import 'server-only';

import {createSupabaseServiceClient} from './db/server';

// Which staff members have a verified TOTP factor (admin API: needs the service-role key).
export async function mfaEnrolment(userIds: string[]): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {};
  try {
    const service = createSupabaseServiceClient();
    await Promise.all(
      userIds.map(async (id) => {
        const {data, error} = await service.auth.admin.mfa.listFactors({userId: id});
        if (error) return; // lookup failed: unknown, shown as "—" rather than as "not enrolled"
        result[id] = !!data?.factors?.some((f) => f.factor_type === 'totp' && f.status === 'verified');
      }),
    );
  } catch {
    // Service key missing: unknown, shown as "—".
  }
  return result;
}
