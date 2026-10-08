import {NextResponse, type NextRequest} from 'next/server';

import {createSupabaseServiceClient} from '@/lib/admin/db/server';
import {isAdminConfigured} from '@/lib/admin/env';
import {buildDigest, digestEmail, digestIsEmpty, type DigestRequest} from '@/lib/admin/digest';
import {sendEmail, siteBaseUrl, staffEmail} from '@/lib/admin/notify';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Daily digest, called by the scheduled function (netlify/functions/daily-digest.mts) with the shared secret.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return new NextResponse('Unauthorized', {status: 401});
  if (!isAdminConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ok: true, sent: 0, skipped: 'not configured'});

  const service = createSupabaseServiceClient();
  const [{data: statuses}, {data: staff}] = await Promise.all([
    service.from('request_statuses').select('code, stage'),
    service.from('staff_profiles').select('id, full_name, role').eq('active', true).eq('notify_digest', true).in('role', ['admin', 'agent']),
  ]);
  const open = (statuses ?? []).filter((s) => s.stage === 'open').map((s) => s.code);
  const {data: rows} = await service
    .from('service_requests')
    .select('id, reference, status, assigned_to, next_follow_up_at, last_activity_at, client:clients(first_name, last_name)')
    .in('status', open)
    .limit(2000);
  const requests: DigestRequest[] = (rows ?? []).map((r: any) => ({
    id: r.id,
    reference: r.reference,
    status: r.status,
    assigned_to: r.assigned_to,
    next_follow_up_at: r.next_follow_up_at,
    last_activity_at: r.last_activity_at,
    clientName: `${r.client.first_name} ${r.client.last_name}`,
  }));

  let sent = 0;
  for (const person of staff ?? []) {
    const digest = buildDigest(requests, person.id, person.role);
    if (digestIsEmpty(digest)) continue;
    const to = await staffEmail(person.id);
    if (to && (await sendEmail({to, ...digestEmail(person.full_name.split(' ')[0], digest, siteBaseUrl())}))) sent += 1;
  }
  return NextResponse.json({ok: true, sent});
}
