'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {createSupabaseServerClient, createSupabaseServiceClient} from '../db/server';
import {isAdminConfigured} from '../env';
import {getRequestOrigin} from '../origin';
import {STAFF_ROLES} from '../roles';
import {safeAdminPath} from '../safe-redirect';
import {isAllowedStaffEmail} from '../staff-email';
import {t} from '../i18n';

export type FormState = {error?: string; success?: string} | undefined;

const MIN_PASSWORD_LENGTH = 12;

const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isAdminConfigured()) return {error: t('admin.auth.not-configured')};
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return {error: t('admin.auth.invalid-credentials')};

  const supabase = await createSupabaseServerClient();
  const {error} = await supabase.auth.signInWithPassword({email: parsed.data.email!, password: parsed.data.password!});
  if (error) return {error: t('admin.auth.invalid-credentials')};

  redirect(safeAdminPath(String(formData.get('next') ?? '')));
}

export async function signOut() {
  if (isAdminConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect('/admin/login');
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isAdminConfigured()) return {error: t('admin.auth.not-configured')};
  const email = z.string().trim().email().safeParse(formData.get('email'));
  // Same answer whether or not the account exists (no account enumeration).
  const generic: FormState = {success: t('admin.auth.reset-sent')};
  if (!email.success) return generic;

  const supabase = await createSupabaseServerClient();
  const origin = await getRequestOrigin();
  await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${origin}/admin/auth/callback?next=/admin/mot-de-passe`,
  });
  return generic;
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isAdminConfigured()) return {error: t('admin.auth.not-configured')};
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {error: t('admin.password.too-short', {min: MIN_PASSWORD_LENGTH})};
  }
  if (password !== confirm) return {error: t('admin.password.mismatch')};

  const supabase = await createSupabaseServerClient();
  const {data} = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');

  const {error} = await supabase.auth.updateUser({password});
  if (error) return {error: t('admin.password.failed')};
  redirect('/admin');
}

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  fullName: z.string().trim().min(2).max(120),
  role: z.enum(STAFF_ROLES as [string, ...string[]]),
});

// Admin-only. Creates the auth user (invite email) and the staff profile in one go; the profile
// is what grants access, so a half-created invitation is rolled back.
export async function inviteStaff(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff('admin');
  const parsed = inviteSchema.safeParse({
    email: formData.get('email'),
    fullName: formData.get('fullName'),
    role: formData.get('role'),
  });
  if (!parsed.success) return {error: t('admin.staff.invite.invalid')};
  if (!isAllowedStaffEmail(parsed.data.email)) return {error: t('admin.staff.invite.domain-not-allowed')};

  const service = createSupabaseServiceClient();
  const origin = await getRequestOrigin();
  const {data, error} = await service.auth.admin.inviteUserByEmail(parsed.data.email, {
    redirectTo: `${origin}/admin/auth/callback?next=/admin/mot-de-passe`,
  });
  if (error || !data.user) return {error: t('admin.staff.invite.failed')};

  const {error: profileError} = await service.from('staff_profiles').insert({
    id: data.user.id,
    full_name: parsed.data.fullName,
    role: parsed.data.role as (typeof STAFF_ROLES)[number],
  });
  if (profileError) {
    await service.auth.admin.deleteUser(data.user.id);
    return {error: t('admin.staff.invite.failed')};
  }

  revalidatePath('/admin/equipe');
  return {success: t('admin.staff.invite.sent', {email: parsed.data.email})};
}
