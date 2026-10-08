'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {t} from '../i18n';
import type {FormState} from '../form-state';
import {addDays, cadenceFor} from '../followup';
import {CHANNELS} from '../vocab';

const uuid = z.string().uuid();

function refresh(id: string) {
  revalidatePath('/admin');
  revalidatePath('/admin/demandes');
  revalidatePath(`/admin/demandes/${id}`);
}

// "Fait": a contact attempt is logged; the next reminder follows the status cadence (or is cleared).
export async function markFollowUpDone(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.requests.failed')};

  const {data: request} = await supabase.from('service_requests').select('status').eq('id', id.data).maybeSingle();
  if (!request) return {error: t('admin.requests.failed')};

  const {error} = await supabase.from('request_events').insert({
    request_id: id.data,
    type: 'contact_attempt',
    channel: 'whatsapp',
    body: t('admin.today.done-note'),
    actor_id: user.id,
  });
  if (error) return {error: t('admin.requests.failed')};

  const next = cadenceFor(request.status);
  await supabase.from('service_requests').update({next_follow_up_at: next ? next.toISOString() : null}).eq('id', id.data);
  refresh(id.data);
  return {success: t('admin.today.done')};
}

// "Reporter": move the reminder (1/3/7 days or a custom date).
export async function snoozeFollowUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.requests.failed')};

  const custom = String(formData.get('date') ?? '');
  const days = Number(formData.get('days'));
  let next: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(custom)) {
    next = new Date(`${custom}T08:00:00`);
    if (Number.isNaN(next.getTime())) return {error: t('admin.today.invalid-date')};
  } else if (Number.isInteger(days) && days >= 1 && days <= 90) {
    next = addDays(Date.now(), days);
  } else {
    return {error: t('admin.today.invalid-date')};
  }

  const {error} = await supabase.from('service_requests').update({next_follow_up_at: next.toISOString()}).eq('id', id.data);
  if (error) return {error: t('admin.requests.failed')};
  await supabase.from('request_events').insert({
    request_id: id.data,
    type: 'note',
    body: t('admin.today.snoozed-note', {date: next.toLocaleDateString('fr-FR')}),
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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return {error: t('admin.today.invalid-date')};
    value = new Date(`${date}T08:00:00`).toISOString();
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
