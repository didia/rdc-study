import {NextResponse, type NextRequest} from 'next/server';

import {createSupabaseServiceClient} from '@/lib/admin/db/server';
import {isAdminConfigured} from '@/lib/admin/env';
import {getRetentionSettings, runRetention} from '@/lib/admin/retention';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Monthly retention sweep (scheduled function). Until `retention_auto` is switched on in /admin/confidentialite it only
// records how many clients *would* be anonymised (dry run), so the first real run is never a surprise.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return new NextResponse('Unauthorized', {status: 401});
  if (!isAdminConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ok: true, skipped: 'not configured'});

  const service = createSupabaseServiceClient();
  const {months, auto} = await getRetentionSettings(service);
  if (!auto) {
    const {data} = await service.rpc('fn_retention_candidates', {p_months: months});
    await service.from('audit_events').insert({type: 'retention_dry_run', metadata: {months, candidates: (data ?? []).length}});
    return NextResponse.json({ok: true, dryRun: true, candidates: (data ?? []).length});
  }
  const result = await runRetention(service, months);
  await service.from('audit_events').insert({type: 'retention_run', metadata: {months, ...result}});
  return NextResponse.json({ok: true, ...result});
}
