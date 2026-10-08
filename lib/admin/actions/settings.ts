'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {t} from '../i18n';
import {submittedValues, type FormState} from '../form-state';

const reasonSchema = z.object({
  code: z.string().trim().regex(/^[a-z0-9_]{2,40}$/),
  label: z.string().trim().min(2).max(80),
});

export async function saveLostReason(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const parsed = reasonSchema.safeParse({code: formData.get('code'), label: formData.get('label')});
  if (!parsed.success) return {error: t('admin.settings.invalid'), values: submittedValues(formData)};
  const active = formData.get('active') === 'on';

  const {data: existing} = await supabase.from('lost_reasons').select('sort_order').eq('code', parsed.data.code).maybeSingle();
  const {data: last} = await supabase.from('lost_reasons').select('sort_order').order('sort_order', {ascending: false}).limit(1);
  const {error} = await supabase.from('lost_reasons').upsert({
    code: parsed.data.code,
    label_fr: parsed.data.label,
    is_active: active,
    sort_order: existing?.sort_order ?? (last?.[0]?.sort_order ?? 0) + 10,
  });
  revalidatePath('/admin/parametres');
  return error ? {error: t('admin.requests.failed')} : {success: t('admin.requests.saved')};
}

const templateSchema = z.object({
  id: z.string().uuid().optional().or(z.literal('')),
  code: z.string().trim().regex(/^[a-z0-9_]{2,40}$/),
  label: z.string().trim().min(2).max(80),
  channel: z.enum(['whatsapp', 'email']),
  body: z.string().trim().min(5).max(2000),
});

export async function saveTemplate(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const parsed = templateSchema.safeParse({
    id: formData.get('id') ?? '',
    code: formData.get('code'),
    label: formData.get('label'),
    channel: formData.get('channel'),
    body: formData.get('body'),
  });
  if (!parsed.success) return {error: t('admin.settings.invalid'), values: submittedValues(formData)};
  const active = formData.get('active') === 'on';

  const row = {
    code: parsed.data.code,
    label: parsed.data.label,
    channel: parsed.data.channel,
    body_fr: parsed.data.body,
    is_active: active,
  };
  const {error} = parsed.data.id
    ? await supabase.from('message_templates').update(row).eq('id', parsed.data.id)
    : await supabase.from('message_templates').insert(row);
  revalidatePath('/admin/modeles');
  if (error) return {error: error.code === '23505' ? t('admin.templates.code-taken') : t('admin.requests.failed'), values: submittedValues(formData)};
  return {success: t('admin.requests.saved')};
}

export async function setRoundRobin(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const enabled = formData.get('enabled') === 'on';
  const {error} = await supabase.from('app_settings').upsert({key: 'round_robin_enabled', value: enabled});
  revalidatePath('/admin/parametres');
  return error ? {error: t('admin.requests.failed')} : {success: t('admin.requests.saved')};
}
