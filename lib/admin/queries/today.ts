import 'server-only';

import type {createSupabaseServerClient} from '../db/server';
import {staleAfterDays} from '../followup';
import type {RequestListItem, StatusRow} from './requests';

type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

const SELECT =
  '*, client:clients!inner(id, first_name, last_name, email, phone, phone_e164, origin_country), assignee:staff_profiles!service_requests_assigned_to_fkey(id, full_name)';

export type TodayData = {
  overdue: RequestListItem[];
  unassignedNew: RequestListItem[];
  waiting: RequestListItem[];
  mine: RequestListItem[];
};

// Mine first, then the oldest reminder first.
const byUrgency = (userId: string) => (a: RequestListItem, b: RequestListItem) => {
  const mine = Number(b.assigned_to === userId) - Number(a.assigned_to === userId);
  if (mine) return mine;
  return (a.next_follow_up_at ?? '').localeCompare(b.next_follow_up_at ?? '');
};

// PostgREST caps every response at `max_rows` (1 000), so each section is read page by page.
const PAGE = 1000;
const MAX_PAGES = 10;

async function fetchAll(build: () => any): Promise<RequestListItem[]> {
  const rows: RequestListItem[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const {data, error} = await build().range(page * PAGE, (page + 1) * PAGE - 1);
    if (error) throw new Error(`Today: ${error.message}`);
    rows.push(...((data ?? []) as RequestListItem[]));
    if ((data?.length ?? 0) < PAGE) break;
  }
  return rows;
}

export async function getTodayData(supabase: Supabase, userId: string, statuses: StatusRow[]): Promise<TodayData> {
  const open = statuses.filter((s) => s.stage === 'open').map((s) => s.code);
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const base = () => supabase.from('service_requests').select(SELECT).in('status', open);

  // A request is waiting too long once its last activity is older than its status's threshold.
  const waitingFilter = open
    .map((code) => `and(status.eq.${code},last_activity_at.lt.${new Date(now - staleAfterDays(code) * 86_400_000).toISOString()})`)
    .join(',');

  const [overdue, unassignedNew, waitingCandidates, mine] = await Promise.all([
    fetchAll(() => base().lte('next_follow_up_at', nowIso).order('next_follow_up_at', {ascending: true}).order('id')),
    fetchAll(() => base().eq('status', 'new').is('assigned_to', null).order('submitted_at', {ascending: true}).order('id')),
    open.length
      ? fetchAll(() => base().or(waitingFilter).order('last_activity_at', {ascending: true}).order('id'))
      : Promise.resolve([]),
    fetchAll(() => base().eq('assigned_to', userId).order('submitted_at', {ascending: false}).order('id')),
  ]);

  overdue.sort(byUrgency(userId));
  const overdueIds = new Set(overdue.map((r) => r.id));
  return {
    overdue,
    unassignedNew,
    waiting: waitingCandidates.filter((r) => !overdueIds.has(r.id)),
    mine,
  };
}

/** Overdue reminders that concern me (mine or nobody's) — the sidebar badge. */
export async function overdueBadgeCount(supabase: Supabase, userId: string, openCodes: string[]): Promise<number> {
  const {count, error} = await supabase
    .from('service_requests')
    .select('id', {count: 'exact', head: true})
    .in('status', openCodes)
    .lte('next_follow_up_at', new Date().toISOString())
    .or(`assigned_to.eq.${userId},assigned_to.is.null`);
  if (error) console.error('overdueBadgeCount failed', error.message);
  return count ?? 0;
}

export async function getLostReasons(supabase: Supabase, includeInactive = false) {
  let query = supabase.from('lost_reasons').select('*').order('sort_order');
  if (!includeInactive) query = query.eq('is_active', true);
  const {data} = await query;
  return data ?? [];
}

export async function getTemplates(supabase: Supabase, includeInactive = false) {
  let query = supabase.from('message_templates').select('*').order('sort_order').order('label');
  if (!includeInactive) query = query.eq('is_active', true);
  const {data} = await query;
  return data ?? [];
}
