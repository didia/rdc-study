import 'server-only';
import * as Sentry from '@sentry/nextjs';

import type {createSupabaseServiceClient} from './db/server';
import {buildDigest, DIGEST_ROLES, digestEmail, digestIsEmpty, type DigestRequest} from './digest';
import {sendEmail, siteBaseUrl, staffEmail} from './notify';

type Service = ReturnType<typeof createSupabaseServiceClient>;

// PostgREST caps every response at `max_rows` (1 000), so the open requests are read page by page.
const PAGE = 1000;
const MAX_PAGES = 10;

async function readOpenRequests(service: Service, open: string[]): Promise<DigestRequest[]> {
  const requests: DigestRequest[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const {data, error} = await service
      .from('service_requests')
      .select('id, reference, status, assigned_to, next_follow_up_at, last_activity_at, client:clients(first_name, last_name)')
      .in('status', open)
      .order('id')
      .range(page * PAGE, (page + 1) * PAGE - 1);
    if (error) throw error;
    const rows = (data ?? []) as any[];
    requests.push(
      ...rows.map((r) => ({
        id: r.id,
        reference: r.reference,
        status: r.status,
        assigned_to: r.assigned_to,
        next_follow_up_at: r.next_follow_up_at,
        last_activity_at: r.last_activity_at,
        clientName: r.client ? `${r.client.first_name} ${r.client.last_name}` : '',
      })),
    );
    if (rows.length < PAGE) return requests;
  }
  // A truncated list mailed as if complete is worse than a failed run.
  throw new Error(`Digest: more than ${MAX_PAGES * PAGE} open requests`);
}

/**
 * Sends the morning digest. Throws when a read fails (nothing is mailed from partial data); a failure for
 * one recipient is reported and counted, and the others still get theirs.
 */
export async function runDigest(service: Service): Promise<{sent: number; failed: number}> {
  const [{data: statuses, error: statusError}, {data: staff, error: staffError}] = await Promise.all([
    service.from('request_statuses').select('code, stage'),
    service.from('staff_profiles').select('id, full_name, role').eq('active', true).eq('notify_digest', true).in('role', [...DIGEST_ROLES]),
  ]);
  if (statusError) throw statusError;
  if (staffError) throw staffError;

  const open = (statuses ?? []).filter((s) => s.stage === 'open').map((s) => s.code);
  if (open.length === 0) throw new Error('Digest: no open request status found');
  const requests = await readOpenRequests(service, open);

  let sent = 0;
  let failed = 0;
  for (const person of staff ?? []) {
    try {
      const digest = buildDigest(requests, person.id, person.role);
      if (digestIsEmpty(digest)) continue;
      const to = await staffEmail(person.id);
      if (to && (await sendEmail({to, ...digestEmail(person.full_name.split(' ')[0], digest, siteBaseUrl())}))) sent += 1;
    } catch (error) {
      failed += 1;
      Sentry.captureException(error, {tags: {area: 'notifications'}});
    }
  }
  return {sent, failed};
}
