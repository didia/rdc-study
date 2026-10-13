'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {t} from '../i18n';
import type {FormState} from '../form-state';
import {addDays, cadenceFor} from '../followup';
import {formatDate, zonedDayStart} from '../format';
import {CHANNELS} from '../vocab';

const uuid = z.string().uuid();

function refresh(id: string) {
  revalidatePath('/admin');
  revalidatePath('/admin/demandes');
  revalidatePath(`/admin/demandes/${id}`);
}

// "Fait": the reminder moves first (only while the request is still open in the status we read), then the contact is logged.
export async function markFollowUpDone(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.requests.failed')};

  const {data: request} = await supabase.from('service_requests').select('status, updated_at').eq('id', id.data).maybeSingle();
  if (!request) return {error: t('admin.requests.failed')};
  const {data: status} = await supabase.from('request_statuses').select('stage').eq('code', request.status).maybeSingle();
  if (status?.stage !== 'open') return {error: t('admin.requests.conflict')};

  const next = cadenceFor(request.status);
  const {data: moved, error: moveError} = await supabase
    .from('service_requests')
    .update({next_follow_up_at: next ? next.toISOString() : null})
    .eq('id', id.data)
    .eq('status', request.status)
    .eq('updated_at', request.updated_at)
    .select('id');
  if (moveError) return {error: t('admin.requests.failed')};
  if (!moved?.length) return {error: t('admin.requests.conflict')};

  // The channel is not captured by this button, so none is recorded rather than a guess.
  const {error} = await supabase.from('request_events').insert({
    request_id: id.data,
    type: 'contact_attempt',
    channel: null,
    body: t('admin.today.done-note'),
    actor_id: user.id,
  });
  refresh(id.data);
  if (error) return {error: t('admin.today.done-not-logged')};
  return {success: t('admin.today.done')};
}

// Calendar day (yyyy-mm-dd) → 08:00 in the office's time zone; null when it is not a real date.
function reminderAt(ymd: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
  return new Date(zonedDayStart(ymd).getTime() + 8 * 3_600_000);
}

// "Reporter": move the reminder (1/3/7 days or a custom date).
export async function snoozeFollowUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.requests.failed')};

  const custom = String(formData.get('date') ?? '');
  const days = Number(formData.get('days'));
  let next: Date | null;
  if (custom) {
    next = reminderAt(custom);
  } else if (Number.isInteger(days) && days >= 1 && days <= 90) {
    next = addDays(Date.now(), days);
  } else {
    next = null;
  }
  if (!next) return {error: t('admin.today.invalid-date')};

  const {data: moved, error} = await supabase
    .from('service_requests')
    .update({next_follow_up_at: next.toISOString()})
    .eq('id', id.data)
    .select('id');
  if (error) return {error: t('admin.requests.failed')};
  if (!moved?.length) return {error: t('admin.requests.conflict')};
  await supabase.from('request_events').insert({
    request_id: id.data,
    type: 'note',
    body: t('admin.today.snoozed-note', {date: formatDate(next.toISOString())}),
    actor_id: user.id,
  });
  refresh(id.data);
  return {success: t('admin.today.snoozed')};
}

// Detail page: set or clear the reminder explicitly.
export async function setFollowUpDate(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.requests.failed')};
  const date = String(formData.get('date') ?? '');
  let value: string | null = null;
  if (date) {
    const at = reminderAt(date);
    if (!at) return {error: t('admin.today.invalid-date')};
    value = at.toISOString();
  }
  const {error} = await supabase.from('service_requests').update({next_follow_up_at: value}).eq('id', id.data);
  refresh(id.data);
  return error ? {error: t('admin.requests.failed')} : {success: t('admin.today.reminder-saved')};
}

const contactSchema = z.object({
  id: uuid,
  channel: z.enum(CHANNELS.map((c) => c.code) as [string, ...string[]]),
  note: z.string().trim().max(2000).optional(),
});

// "Marquer comme contacté + note" after opening WhatsApp/mailto from a template.
export async function logContact(input: {id: string; channel: string; note?: string}): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return {error: t('admin.requests.failed')};
  const {error} = await supabase.from('request_events').insert({
    request_id: parsed.data.id,
    type: 'contact_attempt',
    channel: parsed.data.channel as any,
    body: parsed.data.note || null,
    actor_id: user.id,
  });
  refresh(parsed.data.id);
  return error ? {error: t('admin.requests.failed')} : {success: t('admin.requests.note.added')};
}
