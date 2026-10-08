import 'server-only';

import type {createSupabaseServerClient} from '../db/server';

type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export const AUDIT_PAGE_SIZE = 50;

export type AuditFilters = {actor: string; type: string; from: string; to: string; page: number};

const date = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '');

export function parseAuditFilters(raw: Record<string, string | string[] | undefined>): AuditFilters {
  const one = (k: string) => (Array.isArray(raw[k]) ? (raw[k] as string[])[0] : (raw[k] as string | undefined)) ?? '';
  const page = Number.parseInt(one('page'), 10);
  return {actor: one('actor'), type: one('type'), from: date(one('from')), to: date(one('to')), page: Number.isFinite(page) && page > 0 ? page : 1};
}

const endOf = (day: string) => {
  const next = new Date(`${day}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString();
};

export async function listRequestEvents(supabase: Supabase, f: AuditFilters, pageSize = AUDIT_PAGE_SIZE) {
  let q = supabase
    .from('request_events')
    .select('*, actor:staff_profiles(full_name), request:service_requests(id, reference)', {count: 'exact'})
    .order('created_at', {ascending: false})
    .order('id', {ascending: false});
  if (f.actor) q = q.eq('actor_id', f.actor);
  if (f.type) q = q.eq('type', f.type);
  if (f.from) q = q.gte('created_at', `${f.from}T00:00:00Z`);
  if (f.to) q = q.lt('created_at', endOf(f.to));
  const from = (f.page - 1) * pageSize;
  const {data, count} = await q.range(from, from + pageSize - 1);
  return {rows: (data ?? []) as any[], total: count ?? 0};
}

export async function listAuditEvents(supabase: Supabase, f: AuditFilters) {
  let q = supabase.from('audit_events').select('*, actor:staff_profiles(full_name)').order('created_at', {ascending: false}).limit(100);
  if (f.actor) q = q.eq('actor_id', f.actor);
  if (f.from) q = q.gte('created_at', `${f.from}T00:00:00Z`);
  if (f.to) q = q.lt('created_at', endOf(f.to));
  const {data} = await q;
  return (data ?? []) as any[];
}

export async function listLogins(supabase: Supabase, f: AuditFilters) {
  const from = f.from ? `${f.from}T00:00:00Z` : new Date(Date.now() - 30 * 86_400_000).toISOString();
  const to = f.to ? endOf(f.to) : new Date(Date.now() + 86_400_000).toISOString();
  const {data} = await supabase.rpc('fn_login_events', {p_from: from, p_to: to});
  return data ?? [];
}
