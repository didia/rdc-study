import 'server-only';

import type {createSupabaseServerClient} from '../db/server';

type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type PaymentFilters = {from: string; to: string; method: string; kind: string; agent: string; voided: boolean; page: number};
export const PAYMENTS_PAGE_SIZE = 50;

const date = (v: string | undefined) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '');

export function parsePaymentFilters(raw: Record<string, string | string[] | undefined>): PaymentFilters {
  const one = (k: string) => (Array.isArray(raw[k]) ? (raw[k] as string[])[0] : (raw[k] as string | undefined)) ?? '';
  const page = Number.parseInt(one('page'), 10);
  return {
    from: date(one('from')),
    to: date(one('to')),
    method: one('method'),
    kind: one('kind'),
    agent: one('agent'),
    voided: one('voided') === '1',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

const SELECT = '*, request:service_requests(id, reference, client:clients(first_name, last_name)), recorder:staff_profiles!payments_recorded_by_fkey(full_name)';

export async function listPayments(supabase: Supabase, f: PaymentFilters, pageSize = PAYMENTS_PAGE_SIZE) {
  let query = supabase.from('payments').select(SELECT, {count: 'exact'}).order('paid_at', {ascending: false}).order('created_at', {ascending: false});
  if (f.from) query = query.gte('paid_at', `${f.from}T00:00:00Z`);
  if (f.to) {
    const next = new Date(`${f.to}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    query = query.lt('paid_at', next.toISOString());
  }
  if (f.method) query = query.eq('method', f.method);
  if (f.kind) query = query.eq('kind', f.kind);
  if (f.agent) query = query.eq('recorded_by', f.agent);
  if (!f.voided) query = query.is('voided_at', null);
  const from = (f.page - 1) * pageSize;
  const {data, count} = await query.range(from, from + pageSize - 1);
  return {rows: (data ?? []) as any[], total: count ?? 0};
}
