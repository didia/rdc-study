'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {checklistFor, toggled, type ChecklistState} from '../checklist';
import {listPackages} from '../catalogue';
import {t} from '../i18n';
import {hasRole} from '../roles';

const uuid = z.string().uuid();

function refresh(id: string) {
  revalidatePath('/admin');
  revalidatePath('/admin/demandes');
  revalidatePath(`/admin/demandes/${id}`);
}

// Sales owner and mentor are different roles on a request.
export async function assignMentor(input: {id: string; mentorId: string | null}): Promise<{error?: string}> {
  const {supabase} = await requireStaff('agent');
  if (!uuid.safeParse(input.id).success || (input.mentorId && !uuid.safeParse(input.mentorId).success)) return {error: t('admin.requests.failed')};
  const {error} = await supabase.from('service_requests').update({mentor_id: input.mentorId}).eq('id', input.id);
  refresh(input.id);
  return error ? {error: t('admin.requests.failed')} : {};
}

async function requireDeliveryAccess() {
  const ctx = await requireStaff();
  // Agents and admins manage everything; a mentor only gets here for their own requests (RLS decides).
  if (!hasRole(ctx.profile.role, 'agent') && ctx.profile.role !== 'mentor') throw new Error('forbidden');
  return ctx;
}

// Each tick is logged on the timeline.
export async function toggleChecklistItem(input: {id: string; key: string; done: boolean}): Promise<{error?: string}> {
  const {supabase, user} = await requireDeliveryAccess();
  if (!uuid.safeParse(input.id).success || !/^[a-z0-9_]{1,60}$/.test(input.key)) return {error: t('admin.requests.failed')};

  const {data: request} = await supabase.from('service_requests').select('package_slug, delivery_checklist, updated_at').eq('id', input.id).maybeSingle();
  if (!request) return {error: t('admin.requests.failed')};

  const pkg = listPackages().find((p) => p.slug === request.package_slug);
  const items = checklistFor(request.package_slug, pkg?.services);
  const item = items.find((i) => i.key === input.key);
  if (!item) return {error: t('admin.requests.failed')};

  const next: ChecklistState = toggled(request.delivery_checklist as ChecklistState, input.key, input.done, user.id);
  // The tick and its timeline entry are written together (one transaction), and only if nobody changed the request meanwhile.
  const {data: saved, error} = await supabase.rpc('set_delivery_checklist', {
    p_id: input.id,
    p_expected_updated_at: request.updated_at,
    p_checklist: next as any,
    p_key: input.key,
    p_done: input.done,
    p_label: item.label,
  });
  if (error) return {error: t('admin.requests.failed')};
  if (!saved) return {error: t('admin.requests.conflict')};
  refresh(input.id);
  return {};
}

// Delivery only moves forward: start from deposit_paid/paid, complete from any of the three. Completed is final here,
// and a lost or sales-stage request is never touched (reopening goes through the status dialog and its reason).
const FROM: Record<'in_progress' | 'completed', string[]> = {
  in_progress: ['deposit_paid', 'paid'],
  completed: ['deposit_paid', 'paid', 'in_progress'],
};

export async function setDeliveryStatus(input: {id: string; status: 'in_progress' | 'completed'}): Promise<{error?: string}> {
  const {supabase} = await requireDeliveryAccess();
  if (!uuid.safeParse(input.id).success || !(input.status in FROM)) return {error: t('admin.requests.failed')};

  const {data: request} = await supabase.from('service_requests').select('status, updated_at').eq('id', input.id).maybeSingle();
  if (!request) return {error: t('admin.requests.failed')};
  if (!FROM[input.status].includes(request.status)) return {error: t('admin.requests.conflict')};

  const {data, error} = await supabase
    .from('service_requests')
    .update({status: input.status, status_reason: null})
    .eq('id', input.id)
    .eq('updated_at', request.updated_at)
    .select('id');
  refresh(input.id);
  if (error) return {error: t('admin.requests.failed')};
  return data?.length ? {} : {error: t('admin.requests.conflict')};
}
