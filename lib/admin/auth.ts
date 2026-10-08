import 'server-only';
import {redirect} from 'next/navigation';
import type {User} from '@supabase/supabase-js';

import {createSupabaseServerClient} from './db/server';
import type {Database} from './db/types';
import {isAdminConfigured} from './env';
import {hasRole, type StaffRole} from './roles';

export type StaffProfile = Database['public']['Tables']['staff_profiles']['Row'];

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type StaffContext =
  | {status: 'unconfigured'}
  | {status: 'anonymous'}
  | {status: 'forbidden'; user: User}
  | {status: 'mfa_required'; user: User; profile: StaffProfile}
  | {status: 'ok'; user: User; profile: StaffProfile; supabase: SupabaseServerClient};

// A valid JWT is not enough: an *active* staff_profiles row is required, and a user who
// enrolled TOTP must have completed the second factor (aal2).
export async function getStaffContext(): Promise<StaffContext> {
  if (!isAdminConfigured()) return {status: 'unconfigured'};

  const supabase = await createSupabaseServerClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return {status: 'anonymous'};

  const {data: profile} = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile || !profile.active) return {status: 'forbidden', user};

  const {data: aal} = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
    return {status: 'mfa_required', user, profile};
  }

  return {status: 'ok', user, profile, supabase};
}

export async function requireStaff(minimum: StaffRole = 'viewer') {
  const ctx = await getStaffContext();
  switch (ctx.status) {
    case 'unconfigured':
    case 'anonymous':
      redirect('/admin/login');
    case 'forbidden':
      redirect('/admin/acces-refuse');
    case 'mfa_required':
      redirect('/admin/mfa');
  }
  if (!hasRole(ctx.profile.role, minimum)) redirect('/admin/acces-refuse?raison=role');
  return ctx;
}
