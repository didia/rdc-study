import 'server-only';

import type {createSupabaseServerClient} from '../db/server';
import {searchTerms} from '../list-params';
import type {ClientRow} from './requests';

type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export const CLIENTS_PAGE_SIZE = 25;

export async function listClients(supabase: Supabase, q: string, page: number) {
  let query = supabase
    .from('clients')
    .select('*, requests:service_requests(count)', {count: 'exact'})
    .order('created_at', {ascending: false});
  for (const term of searchTerms(q)) {
    const like = `%${term}%`;
    query = query.or(`first_name.ilike.${like},last_name.ilike.${like},email.ilike.${like},phone.ilike.${like},phone_e164.ilike.${like}`);
  }
  const from = (page - 1) * CLIENTS_PAGE_SIZE;
  const {data, count} = await query.range(from, from + CLIENTS_PAGE_SIZE - 1);
  const rows = (data ?? []).map((c: any) => ({...c, request_count: c.requests?.[0]?.count ?? 0})) as (ClientRow & {
    request_count: number;
  })[];
  return {rows, total: count ?? 0};
}

export async function getClient(supabase: Supabase, id: string) {
  const {data} = await supabase.from('clients').select('*').eq('id', id).maybeSingle();
  return data;
}

/** Existing clients that could be the same person (exact email or phone). */
export async function findClientMatches(supabase: Supabase, email: string | null, phoneE164: string | null) {
  const filters: string[] = [];
  if (email) filters.push(`email.eq.${email}`);
  if (phoneE164) filters.push(`phone_e164.eq.${phoneE164}`);
  if (!filters.length) return [];
  const {data} = await supabase.from('clients').select('id, first_name, last_name, email, phone').or(filters.join(',')).limit(5);
  return data ?? [];
}
