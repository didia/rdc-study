import {NextResponse, type NextRequest} from 'next/server';

import {getStaffContext} from '@/lib/admin/auth';
import {toCsv} from '@/lib/admin/csv';
import {listRequestEvents, parseAuditFilters} from '@/lib/admin/queries/audit';

export const dynamic = 'force-dynamic';

const EXPORT_LIMIT = 20000;
// PostgREST caps a response at `max_rows` (1 000 in supabase/config.toml), so the journal is read page by page.
const EXPORT_PAGE = 1000;

// Audit export (admin only); the export itself is audited.
export async function GET(request: NextRequest) {
  const ctx = await getStaffContext();
  if (ctx.status !== 'ok' || ctx.profile.role !== 'admin') return new NextResponse('Forbidden', {status: 403});

  const filters = parseAuditFilters(Object.fromEntries(request.nextUrl.searchParams.entries()));
  const rows: Awaited<ReturnType<typeof listRequestEvents>>['rows'] = [];
  let total = 0;
  for (let page = 1; ; page += 1) {
    const result = await listRequestEvents(ctx.supabase, {...filters, page}, EXPORT_PAGE);
    if (result.error) return new NextResponse('Export failed', {status: 500});
    total = result.total;
    rows.push(...result.rows);
    if (total > EXPORT_LIMIT) return new NextResponse('Too many rows to export; narrow the filters', {status: 413});
    if (rows.length >= total || !result.rows.length) break;
  }
  // Never hand out a file that looks complete but is not.
  if (rows.length !== total) return new NextResponse('Export incomplete; try again', {status: 500});

  // The file only leaves once its audit row is written.
  const {error: auditError} = await ctx.supabase.from('audit_events').insert({
    actor_id: ctx.user.id,
    type: 'export_audit',
    metadata: {filters: request.nextUrl.search, rows: rows.length, total},
  });
  if (auditError) return new NextResponse('Export failed', {status: 500});

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
