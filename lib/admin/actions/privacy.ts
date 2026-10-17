'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {createSupabaseServiceClient} from '../db/server';
import type {FormState} from '../form-state';
import {t} from '../i18n';
import {anonymiseClientAndFiles, getRetentionSettings, retentionFailed, runRetention} from '../retention';

const uuid = z.string().uuid();

export async function saveRetentionSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const months = Number(formData.get('months'));
  if (!Number.isInteger(months) || months < 6 || months > 120) return {error: t('admin.privacy.invalid-months')};
  const auto = formData.get('auto') === 'on';
  const {error} = await supabase.from('app_settings').upsert([
    {key: 'retention_months', value: months},
    {key: 'retention_auto', value: auto},
  ]);
  revalidatePath('/admin/confidentialite');
  return error ? {error: t('admin.requests.failed')} : {success: t('admin.requests.saved')};
}

// Manual run from the console (after looking at the dry-run list). Uses the saved duration, never a posted one.
export async function runRetentionNow(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  if (formData.get('confirm') !== 'yes') return {error: t('admin.privacy.confirm-needed')};
  try {
    const {months} = await getRetentionSettings(supabase);
    // The service client is only used for the storage deletion; the data change itself is admin-checked in SQL.
    const result = await runRetention(adminDb(supabase), months);
    revalidatePath('/admin/confidentialite');
    if (retentionFailed(result)) return {error: t('admin.privacy.partial', {count: result.anonymised, failed: result.failed + result.filesFailed})};
    return {success: t('admin.privacy.done', {count: result.anonymised, files: result.files})};
  } catch {
    return {error: t('admin.requests.failed')};
  }
}

// Subject-access deletion: anonymise one client on request.
export async function anonymiseClientAction(formData: FormData) {
  const {supabase} = await requireStaff('admin');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) redirect('/admin/clients');
  if (formData.get('confirm') !== 'yes') redirect(`/admin/clients/${id.data}?erreur=confirmation`);
  let outcome: 'ok' | 'failed' | 'files' = 'ok';
  try {
    const drained = await anonymiseClientAndFiles(adminDb(supabase), id.data, 'subject_request');
    if (drained.failed > 0) outcome = 'files';
  } catch {
    outcome = 'failed';
  }
  revalidatePath('/admin/clients');
  redirect(`/admin/clients/${id.data}${outcome === 'ok' ? '' : `?erreur=${outcome}`}`);
}

function adminDb(supabase: Awaited<ReturnType<typeof requireStaff>>['supabase']) {
  return {rpc: supabase.rpc.bind(supabase) as any, from: supabase.from.bind(supabase) as any, storage: createSupabaseServiceClient().storage};
}
