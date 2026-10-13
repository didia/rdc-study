import {NextResponse, type NextRequest} from 'next/server';

import {getStaffContext} from '@/lib/admin/auth';
import {toCsv} from '@/lib/admin/csv';
import {parseListParams, toQueryString} from '@/lib/admin/list-params';
import {listRequests} from '@/lib/admin/queries/requests';
import {packageLabel} from '@/lib/admin/catalogue';
import {canEdit} from '@/lib/admin/roles';
import {serviceLabel, sourceLabel} from '@/lib/admin/vocab';

export const dynamic = 'force-dynamic';

const EXPORT_LIMIT = 5000;
// PostgREST caps a response at `max_rows` (1 000 in supabase/config.toml), so the list is read page by page.
const EXPORT_PAGE = 1000;

// CSV of the current filtered list. Personal data leaves the system, so it is agent+ only and audit-logged.
export async function GET(request: NextRequest) {
  const ctx = await getStaffContext();
  if (ctx.status !== 'ok' || !canEdit(ctx.profile.role)) return new NextResponse('Forbidden', {status: 403});

  const params = parseListParams(Object.fromEntries(request.nextUrl.searchParams.entries()));
  const rows: Awaited<ReturnType<typeof listRequests>>['rows'] = [];
  let total = 0;
  for (let page = 1; ; page += 1) {
    const result = await listRequests(ctx.supabase, {...params, page}, ctx.user.id, EXPORT_PAGE);
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
    type: 'export_requests',
    metadata: {filters: toQueryString({...params, page: 1}), rows: rows.length, total},
  });
  if (auditError) return new NextResponse('Export failed', {status: 500});

  const csv = toCsv(
    ['Référence', 'Prénom', 'Nom', 'E-mail', 'Téléphone', 'Pays d’origine', 'Service', 'Dossier', 'Destination', 'Statut', 'Responsable', 'Source', 'Reçue le', 'Dernière activité'],
    rows.map((r) => [
      r.reference,
      r.client.first_name,
      r.client.last_name,
      r.client.email,
      r.client.phone,
      r.client.origin_country,
      serviceLabel(r.service_type),
      r.package_slug ? packageLabel(r.package_slug) : '',
      r.destination_country,
      r.status,
      r.assignee?.full_name,
      sourceLabel(r.source),
      r.submitted_at,
      r.last_activity_at,
    ]),
  );
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="demandes-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
