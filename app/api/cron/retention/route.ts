import * as Sentry from '@sentry/nextjs';
import {NextResponse, type NextRequest} from 'next/server';

import {createSupabaseServiceClient} from '@/lib/admin/db/server';
import {isAdminConfigured} from '@/lib/admin/env';
import {getRetentionSettings, retentionFailed, runRetention} from '@/lib/admin/retention';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Monthly retention sweep (scheduled function). Until `retention_auto` is switched on in /admin/confidentialite it only
// records how many clients *would* be anonymised (dry run), so the first real run is never a surprise.
// A failure answers 500 (and records nothing as a clean month) so the scheduled run turns red.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return new NextResponse('Unauthorized', {status: 401});
  if (!isAdminConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ok: true, skipped: 'not configured'});

  const service = createSupabaseServiceClient();
  try {
    const {months, auto} = await getRetentionSettings(service);
    if (!auto) {
      const {data, error} = await service.rpc('fn_retention_candidates', {p_months: months});
      if (error) throw error;
      await service.from('audit_events').insert({type: 'retention_dry_run', metadata: {months, candidates: (data ?? []).length}});
      return NextResponse.json({ok: true, dryRun: true, candidates: (data ?? []).length});
    }
    const result = await runRetention(service, months);
    await service.from('audit_events').insert({type: 'retention_run', metadata: {months, ...result}});
    return NextResponse.json({ok: !retentionFailed(result), ...result}, {status: retentionFailed(result) ? 500 : 200});
  } catch (error) {
    Sentry.captureException(error, {tags: {area: 'retention'}});
    return NextResponse.json({ok: false, error: 'retention failed'}, {status: 500});
  }
}
