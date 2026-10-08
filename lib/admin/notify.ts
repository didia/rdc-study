import 'server-only';
import * as Sentry from '@sentry/nextjs';

import {createSupabaseServiceClient} from './db/server';
import {newRequestEmail} from './digest';
import {serviceLabel} from './vocab';

export type Email = {to: string; subject: string; text: string; html: string};

export const siteBaseUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rdcetudes.com').replace(/\/$/, '');

// Transactional email through Resend's HTTP API (no SDK). Not configured = silently skipped: the legacy
// contact-form email keeps notifying the team until this is set up.
export async function sendEmail(email: Email): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM;
  if (!key || !from) return false;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from, to: [email.to], subject: email.subject, text: email.text, html: email.html}),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Resend ${response.status}`);
    return true;
  } catch (error) {
    Sentry.captureException(error, {tags: {area: 'notifications'}});
    return false;
  }
}

/** Email address of a staff member (lives in auth.users, service role only). */
export async function staffEmail(userId: string): Promise<string | null> {
  const {data} = await createSupabaseServiceClient().auth.admin.getUserById(userId);
  return data.user?.email ?? null;
}

// After a website request is stored: tell the assigned person, or the admins who asked to be told.
export async function notifyNewRequest(requestId: string): Promise<void> {
  const service = createSupabaseServiceClient();
  const {data: request} = await service
    .from('service_requests')
    .select('id, reference, service_type, destination_country, assigned_to, client:clients(first_name, last_name)')
    .eq('id', requestId)
    .maybeSingle();
  if (!request) return;

  let recipients: string[];
  if (request.assigned_to) {
    const {data: person} = await service.from('staff_profiles').select('id, notify_new_request').eq('id', request.assigned_to).maybeSingle();
    recipients = person?.notify_new_request ? [person.id] : [];
  } else {
    const {data: admins} = await service.from('staff_profiles').select('id').eq('role', 'admin').eq('active', true).eq('notify_new_request', true);
    recipients = (admins ?? []).map((a) => a.id);
  }

  const client = (request as any).client;
  const mail = newRequestEmail({
    reference: request.reference,
    clientName: `${client.first_name} ${client.last_name}`,
    service: serviceLabel(request.service_type),
    destination: request.destination_country,
    requestId: request.id,
    baseUrl: siteBaseUrl(),
  });
  for (const id of recipients) {
    const to = await staffEmail(id);
    if (to) await sendEmail({to, ...mail});
  }
}
