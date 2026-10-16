import type {SupabaseClient} from '@supabase/supabase-js';

type MfaApi = Pick<SupabaseClient['auth']['mfa'], 'listFactors' | 'unenroll' | 'enroll'>;

// Starts a TOTP enrollment. A previous attempt that was never confirmed (page refreshed or
// closed) leaves an unverified factor on the account: its secret is lost and, while it lives,
// its friendly name would make a new enrollment fail (mfa_factor_name_conflict). So abandoned
// unverified factors are removed first, and every attempt gets a unique name.
export async function startTotpEnrollment(mfa: MfaApi, label: string) {
  const {data: factors} = await mfa.listFactors();
  const abandoned = (factors?.all ?? []).filter((f) => f.factor_type === 'totp' && f.status === 'unverified');
  await Promise.all(abandoned.map((f) => mfa.unenroll({factorId: f.id})));

  return mfa.enroll({
    factorType: 'totp',
    friendlyName: `${label} ${new Date().toISOString().slice(0, 19)}Z`,
  });
}
