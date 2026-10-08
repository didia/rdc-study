import 'server-only';

import {createSupabaseServiceClient} from './db/server';

// Which staff members have a verified TOTP factor (admin API: needs the service-role key).
export async function mfaEnrolment(userIds: string[]): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {};
  try {
    const service = createSupabaseServiceClient();
    await Promise.all(
      userIds.map(async (id) => {
        const {data} = await service.auth.admin.mfa.listFactors({userId: id});
        result[id] = !!data?.factors?.some((f) => f.factor_type === 'totp' && f.status === 'verified');
      }),
    );
  } catch {
    // Service key missing: unknown, shown as "—".
  }
  return result;
}
