import {NextResponse, type NextRequest} from 'next/server';

import {getStaffContext} from '@/lib/admin/auth';
import {toCsv} from '@/lib/admin/csv';
import {kindLabel, methodLabel} from '@/lib/admin/money';
import {listPayments, parsePaymentFilters} from '@/lib/admin/queries/payments';

export const dynamic = 'force-dynamic';

const EXPORT_LIMIT = 10000;
// PostgREST caps a response at `max_rows` (1 000 in supabase/config.toml), so the ledger is read page by page.
const EXPORT_PAGE = 1000;

// Month-end export of payments: money data leaves the system, so admin only and audit-logged.
export async function GET(request: NextRequest) {
  const ctx = await getStaffContext();
  if (ctx.status !== 'ok' || ctx.profile.role !== 'admin') return new NextResponse('Forbidden', {status: 403});

  const filters = parsePaymentFilters(Object.fromEntries(request.nextUrl.searchParams.entries()));
  const rows: Awaited<ReturnType<typeof listPayments>>['rows'] = [];
  let total = 0;
  for (let page = 1; ; page += 1) {
    const result = await listPayments(ctx.supabase, {...filters, page}, EXPORT_PAGE);
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
    type: 'export_payments',
    metadata: {filters: request.nextUrl.search, rows: rows.length, total},
  });
  if (auditError) return new NextResponse('Export failed', {status: 500});

  const csv = toCsv(
    ['Date', 'Référence', 'Client', 'Type', 'Montant', 'Devise', 'Moyen', 'Référence paiement', 'Enregistré par', 'Annulé', 'Raison d’annulation'],
    rows.map((p) => [
      p.paid_at?.slice(0, 10),
      p.request?.reference,
      `${p.request?.client?.first_name ?? ''} ${p.request?.client?.last_name ?? ''}`.trim(),
      kindLabel(p.kind),
      (p.kind === 'refund' ? -p.amount_cents : p.amount_cents) / 100,
      p.currency,
      methodLabel(p.method),
      p.external_ref,
      p.recorder?.full_name,
      p.voided_at ? 'oui' : '',
      p.void_reason,
    ]),
  );
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="paiements-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
