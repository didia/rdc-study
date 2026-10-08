'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {t} from '../i18n';
import {STAFF_ROLES} from '../roles';
import type {FormState} from '../form-state';

const uuid = z.string().uuid();

export async function setStaffRole(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const id = uuid.safeParse(formData.get('id'));
  const role = String(formData.get('role'));
  if (!id.success || !STAFF_ROLES.includes(role as any)) return {error: t('admin.requests.failed')};

  // The database refuses to demote the last active admin.
  const {error} = await supabase.from('staff_profiles').update({role: role as any}).eq('id', id.data);
  revalidatePath('/admin/equipe');
  return error ? {error: error.message.includes('last active admin') ? t('admin.staff.last-admin') : t('admin.requests.failed')} : {success: t('admin.requests.saved')};
}

export async function setStaffActive(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.requests.failed')};
  const active = formData.get('active') === 'true';

  const {error} = await supabase.from('staff_profiles').update({active}).eq('id', id.data);
  revalidatePath('/admin/equipe');
  return error ? {error: error.message.includes('last active admin') ? t('admin.staff.last-admin') : t('admin.requests.failed')} : {success: t('admin.requests.saved')};
}
