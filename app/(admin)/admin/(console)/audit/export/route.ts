import {NextResponse, type NextRequest} from 'next/server';

import {getStaffContext} from '@/lib/admin/auth';
import {toCsv} from '@/lib/admin/csv';
import {listRequestEvents, parseAuditFilters} from '@/lib/admin/queries/audit';

export const dynamic = 'force-dynamic';

// Audit export (admin only); the export itself is audited.
export async function GET(request: NextRequest) {
  const ctx = await getStaffContext();
  if (ctx.status !== 'ok' || ctx.profile.role !== 'admin') return new NextResponse('Forbidden', {status: 403});

  const filters = parseAuditFilters(Object.fromEntries(request.nextUrl.searchParams.entries()));
  const {rows, total} = await listRequestEvents(ctx.supabase, {...filters, page: 1}, 10000);
  await ctx.supabase.from('audit_events').insert({
    actor_id: ctx.user.id,
    type: 'export_audit',
    metadata: {filters: request.nextUrl.search, rows: rows.length, total},
  });

  const csv = toCsv(
    ['Date', 'Acteur', 'Type', 'Référence', 'De', 'Vers', 'Canal', 'Détail'],
    rows.map((e) => [e.created_at, e.actor?.full_name ?? 'système', e.type, e.request?.reference, e.from_status, e.to_status, e.channel, e.body]),
  );
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="audit-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
