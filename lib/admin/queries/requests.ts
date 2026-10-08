import 'server-only';

import type {createSupabaseServerClient} from '../db/server';
import type {Database} from '../db/types';
import {PAGE_SIZE, searchTerms, type ListParams} from '../list-params';

type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type StatusRow = Database['public']['Tables']['request_statuses']['Row'];
export type RequestRow = Database['public']['Tables']['service_requests']['Row'];
export type ClientRow = Database['public']['Tables']['clients']['Row'];
export type EventRow = Database['public']['Tables']['request_events']['Row'];

export type RequestListItem = RequestRow & {
  client: Pick<ClientRow, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'phone_e164' | 'origin_country'>;
  assignee: {id: string; full_name: string} | null;
};

const LIST_SELECT =
  '*, client:clients!inner(id, first_name, last_name, email, phone, phone_e164, origin_country), assignee:staff_profiles!service_requests_assigned_to_fkey(id, full_name)';

export async function getStatuses(supabase: Supabase, includeInactive = false): Promise<StatusRow[]> {
  let query = supabase.from('request_statuses').select('*').order('sort_order');
  if (!includeInactive) query = query.eq('is_active', true);
  const {data} = await query;
  return data ?? [];
}

// Applies every filter except `status` (the pills need counts that ignore it).
async function applyFilters<T extends {or: any; eq: any; gte: any; lt: any; in: any; is: any}>(
  supabase: Supabase,
  query: T,
  params: ListParams,
  userId: string,
  {withStatus}: {withStatus: boolean},
): Promise<{query: T}> {
  // Wrapped: a PostgREST builder is thenable, so returning it bare from an async function would execute it.
  let q: any = query;

  const terms = searchTerms(params.q);
  if (terms.length) {
    // Each term must match the reference or one of the client's fields.
    let clientQuery = supabase.from('clients').select('id');
    for (const term of terms) {
      const like = `%${term}%`;
      clientQuery = clientQuery.or(
        `first_name.ilike.${like},last_name.ilike.${like},email.ilike.${like},phone.ilike.${like},phone_e164.ilike.${like}`,
      );
    }
    const {data: matches} = await clientQuery.limit(500);
    const ids = (matches ?? []).map((c) => c.id);
    const referenceLike = `%${terms.join(' ')}%`;
    q = ids.length
      ? q.or(`reference.ilike.${referenceLike},client_id.in.(${ids.join(',')})`)
      : q.ilike('reference', referenceLike);
  }

  if (withStatus && params.status.length) q = q.in('status', params.status);
  if (params.service) q = q.eq('service_type', params.service);
  if (params.destination) q = q.eq('destination_country', params.destination);
  if (params.source) q = q.eq('source', params.source);
  if (params.origin) q = q.eq('client.origin_country', params.origin);
  if (params.assignee === 'none') q = q.is('assigned_to', null);
  else if (params.assignee === 'me') q = q.eq('assigned_to', userId);
  else if (params.assignee) q = q.eq('assigned_to', params.assignee);
  if (params.from) q = q.gte('submitted_at', `${params.from}T00:00:00Z`);
  if (params.to) {
    const next = new Date(`${params.to}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    q = q.lt('submitted_at', next.toISOString());
  }
  return {query: q};
}

export async function listRequests(supabase: Supabase, params: ListParams, userId: string, pageSize = PAGE_SIZE) {
  let query: any = supabase.from('service_requests').select(LIST_SELECT, {count: 'exact'});
  query = (await applyFilters(supabase, query, params, userId, {withStatus: true})).query;
  const from = (params.page - 1) * pageSize;
  const {data, count, error} = await query
    .order(params.sort, {ascending: params.dir === 'asc'})
    .order('created_at', {ascending: false})
    .range(from, from + pageSize - 1);
  return {rows: (data ?? []) as RequestListItem[], total: count ?? 0, error};
}

/** Counts per status for the current filters (status filter excluded) — the replacement for the spreadsheet tabs. */
export async function statusCounts(supabase: Supabase, params: ListParams, userId: string) {
  let query: any = supabase.from('service_requests').select('status, client:clients!inner(origin_country)');
  query = (await applyFilters(supabase, query, params, userId, {withStatus: false})).query;
  const {data} = await query.limit(10000);
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as {status: string}[]) counts[row.status] = (counts[row.status] ?? 0) + 1;
  return counts;
}

export async function getRequest(supabase: Supabase, id: string) {
  const {data} = await supabase
    .from('service_requests')
    .select('*, client:clients(*), assignee:staff_profiles!service_requests_assigned_to_fkey(id, full_name)')
    .eq('id', id)
    .maybeSingle();
  return data as (RequestRow & {client: ClientRow; assignee: {id: string; full_name: string} | null}) | null;
}

export async function getRequestEvents(supabase: Supabase, requestId: string) {
  const {data} = await supabase
    .from('request_events')
    .select('*, actor:staff_profiles(full_name)')
    .eq('request_id', requestId)
    .order('created_at', {ascending: false})
    .order('id', {ascending: false});
  return (data ?? []) as (EventRow & {actor: {full_name: string} | null})[];
}

export async function getClientRequests(supabase: Supabase, clientId: string, excludeId?: string) {
  let query = supabase
    .from('service_requests')
    .select('id, reference, service_type, package_slug, destination_country, status, submitted_at')
    .eq('client_id', clientId)
    .order('submitted_at', {ascending: false});
  if (excludeId) query = query.neq('id', excludeId);
  const {data} = await query;
  return data ?? [];
}

export async function listStaff(supabase: Supabase, activeOnly = true) {
  let query = supabase.from('staff_profiles').select('id, full_name, role, active, whatsapp, created_at').order('full_name');
  if (activeOnly) query = query.eq('active', true);
  const {data} = await query;
  return data ?? [];
}

/** Open requests per assignee (workload), keyed by staff id; '' = unassigned. */
export async function openLoadByAssignee(supabase: Supabase, openCodes: string[]) {
  const {data} = await supabase.from('service_requests').select('assigned_to').in('status', openCodes).limit(10000);
  const load: Record<string, number> = {};
  for (const row of data ?? []) load[row.assigned_to ?? ''] = (load[row.assigned_to ?? ''] ?? 0) + 1;
  return load;
}
