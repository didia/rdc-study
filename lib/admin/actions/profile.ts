'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import type {FormState} from '../form-state';
import {submittedValues} from '../form-state';
import {t} from '../i18n';

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().max(40).optional(),
});

// A member edits their own profile only (RLS: self-update; role/active are guarded by a trigger).
export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff();
  const parsed = schema.safeParse({fullName: formData.get('fullName'), whatsapp: formData.get('whatsapp') ?? ''});
  if (!parsed.success) return {error: t('admin.settings.invalid'), values: submittedValues(formData)};
  const {error} = await supabase
    .from('staff_profiles')
    .update({
      full_name: parsed.data.fullName,
      whatsapp: parsed.data.whatsapp || null,
      notify_new_request: formData.get('notifyNewRequest') === 'on',
      notify_digest: formData.get('notifyDigest') === 'on',
    })
    .eq('id', user.id);
  revalidatePath('/admin', 'layout');
  return error ? {error: t('admin.requests.failed')} : {success: t('admin.requests.saved')};
}
