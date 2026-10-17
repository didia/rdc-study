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
  | {status: 'mfa_setup_required'; user: User; profile: StaffProfile; supabase: SupabaseServerClient}
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

  // Enforced for admin/agent: without a verified second factor they must enrol first. The database enforces the
  // same rule (staff_role() needs aal2), this only routes the person to the right page.
  if (profile.role === 'admin' || profile.role === 'agent') {
    const {data: enforced} = await supabase.rpc('mfa_enforced');
    if (enforced && aal?.currentLevel !== 'aal2') return {status: 'mfa_setup_required', user, profile, supabase};
  }

  return {status: 'ok', user, profile, supabase};
}

export async function requireStaff(minimum: StaffRole = 'viewer', options: {allowMfaSetup?: boolean} = {}) {
  const ctx = await getStaffContext();
  switch (ctx.status) {
    case 'unconfigured':
    case 'anonymous':
      redirect('/admin/login');
    case 'forbidden':
      redirect('/admin/acces-refuse');
    case 'mfa_required':
      redirect('/admin/mfa');
    case 'mfa_setup_required':
      if (!options.allowMfaSetup) redirect('/admin/securite?obligatoire=1');
      return {...ctx, supabase: ctx.supabase};
  }
  if (!hasRole(ctx.profile.role, minimum)) redirect('/admin/acces-refuse?raison=role');
  return ctx;
}
