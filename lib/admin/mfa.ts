import type {SupabaseClient} from '@supabase/supabase-js';

// Where a session that still owes its second factor is sent before changing the password
// (recovery and invitation links only establish an aal1 session).
export const MFA_THEN_PASSWORD_PATH = `/admin/mfa?next=${encodeURIComponent('/admin/mot-de-passe')}`;

// True when the user has a verified second factor but this session has not used it yet.
export async function needsMfaChallenge(supabase: Pick<SupabaseClient, 'auth'>): Promise<boolean> {
  const {data} = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return !!data && data.nextLevel === 'aal2' && data.currentLevel !== 'aal2';
}
