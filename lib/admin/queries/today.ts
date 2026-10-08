import 'server-only';

import type {createSupabaseServerClient} from '../db/server';
import {isOverdue, isWaitingTooLong} from '../followup';
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

export async function getTodayData(supabase: Supabase, userId: string, statuses: StatusRow[]): Promise<TodayData> {
  const open = statuses.filter((s) => s.stage === 'open').map((s) => s.code);
  const {data} = await supabase
    .from('service_requests')
    .select(SELECT)
    .in('status', open)
    .order('submitted_at', {ascending: false})
    .limit(1000);
  const rows = (data ?? []) as unknown as RequestListItem[];
  const now = Date.now();

  const overdue = rows.filter((r) => isOverdue(r.next_follow_up_at, now)).sort(byUrgency(userId));
  const overdueIds = new Set(overdue.map((r) => r.id));
  return {
    overdue,
    unassignedNew: rows.filter((r) => r.status === 'new' && !r.assigned_to),
    waiting: rows
      .filter((r) => !overdueIds.has(r.id) && isWaitingTooLong(r.status, r.last_activity_at, now))
      .sort((a, b) => a.last_activity_at.localeCompare(b.last_activity_at)),
    mine: rows.filter((r) => r.assigned_to === userId),
  };
}

/** Overdue reminders that concern me (mine or nobody's) — the sidebar badge. */
export async function overdueBadgeCount(supabase: Supabase, userId: string, openCodes: string[]): Promise<number> {
  const {count} = await supabase
    .from('service_requests')
    .select('id', {count: 'exact', head: true})
    .in('status', openCodes)
    .lte('next_follow_up_at', new Date().toISOString())
    .or(`assigned_to.eq.${userId},assigned_to.is.null`);
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
