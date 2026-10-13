'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {t} from '../i18n';
import {nextFollowUpOnStatusChange} from '../followup';
import {STATUS_ERRORS, type StatusError} from '../status-errors';
import {listPackages} from '../catalogue';
import {findClientMatches} from '../queries/clients';
import {CHANNELS, DESTINATION_COUNTRIES, MANUAL_SOURCES, normalizeCountry, normalizePhone, ORIGIN_COUNTRIES, SERVICE_TYPES} from '../vocab';
import {submittedValues, type FormState} from '../form-state';

const CONFLICT = () => t('admin.requests.conflict');
const FAILED = () => t('admin.requests.failed');

const uuid = z.string().uuid();
const blank = (value: unknown) => {
  const text = typeof value === 'string' ? value.trim() : '';
  return text === '' ? null : text;
};

function revalidate(id?: string) {
  revalidatePath('/admin/demandes');
  if (id) revalidatePath(`/admin/demandes/${id}`);
}

// ---------------------------------------------------------------------------
// Status & assignment (detail page and bulk)
// ---------------------------------------------------------------------------

type StatusChangeOptions = {
  reason: string | null;
  lostReason?: string | null;
  followUp?: string; // 'auto' | 'none' | '<days>'
  expectedUpdatedAt: string | null;
};

// 'auto' | 'none' | a snooze of 1–90 days.
const validFollowUp = (choice: string) => choice === 'auto' || choice === 'none' || (/^\d{1,2}$/.test(choice) && Number(choice) >= 1 && Number(choice) <= 90);

async function applyStatusChange(
  supabase: Awaited<ReturnType<typeof requireStaff>>['supabase'],
  id: string,
  toStatus: string,
  {reason, lostReason, followUp = 'auto', expectedUpdatedAt}: StatusChangeOptions,
): Promise<StatusError | null> {
  const {data: statuses} = await supabase.from('request_statuses').select('code, stage');
  const stageOf = (code: string) => statuses?.find((s) => s.code === code)?.stage;
  const toStage = stageOf(toStatus);
  if (!toStage) return 'invalid';

  const {data: current} = await supabase.from('service_requests').select('status, updated_at').eq('id', id).maybeSingle();
  if (!current) return 'failed';
  if (current.status === toStatus) return null;
  if (stageOf(current.status) === 'lost' && toStage !== 'lost' && !reason) {
    return 'reopen';
  }
  if (toStage === 'lost') {
    // The database enforces a reason too; this also refuses a deactivated one with a readable message.
    if (!lostReason) return 'lost-reason';
    const {data: reason} = await supabase.from('lost_reasons').select('code').eq('code', lostReason).eq('is_active', true).maybeSingle();
    if (!reason) return 'lost-reason';
  }
  if (!validFollowUp(followUp)) return 'invalid';

  const patch: any = {status: toStatus, status_reason: reason};
  if (toStage === 'lost') patch.lost_reason = lostReason;
  const reminder = nextFollowUpOnStatusChange(toStage, toStatus, followUp);
  if (reminder.set) patch.next_follow_up_at = reminder.value ? reminder.value.toISOString() : null;

  let query = supabase.from('service_requests').update(patch).eq('id', id);
  if (expectedUpdatedAt) query = query.eq('updated_at', expectedUpdatedAt);
  const {data, error} = await query.select('id');
  if (error) return error.code === '23503' || error.code === '23514' ? 'lost-reason' : 'failed';
  if (!data?.length) return 'conflict';
  return null;
}

async function changeStatusImpl(formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  const toStatus = String(formData.get('status') ?? '');
  if (!id.success || !toStatus) return {error: FAILED()};

  const error = await applyStatusChange(supabase, id.data, toStatus, {
    reason: blank(formData.get('reason')),
    lostReason: blank(formData.get('lostReason')),
    followUp: String(formData.get('followUp') ?? 'auto'),
    expectedUpdatedAt: blank(formData.get('updatedAt')),
  });
  revalidate(id.data);
  return error ? {error: STATUS_ERRORS[error]()} : {success: t('admin.requests.status.changed')};
}

export async function changeStatus(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await changeStatusImpl(formData);
  return result?.error ? {...result, values: submittedValues(formData)} : result;
}

// Board drag & drop and keyboard moves: same rules and same history as the status dialog. The card's
// `updatedAt` is required, so a stale board is refused (conflict) instead of overwriting a newer change.
export async function moveRequestStatus(input: {
  id: string;
  status: string;
  updatedAt: string;
  lostReason?: string | null;
  reason?: string | null;
}): Promise<{error?: string}> {
  const {supabase} = await requireStaff('agent');
  const id = uuid.safeParse(input.id);
  if (!id.success || !input.status || !input.updatedAt) return {error: FAILED()};
  const error = await applyStatusChange(supabase, id.data, input.status, {
    reason: blank(input.reason),
    lostReason: input.lostReason ?? null,
    expectedUpdatedAt: input.updatedAt,
  });
  revalidate(id.data);
  return error ? {error: STATUS_ERRORS[error]()} : {};
}

export async function assignRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  const assignee = blank(formData.get('assignee'));
  if (!id.success || (assignee && !uuid.safeParse(assignee).success)) return {error: FAILED()};

  let query = supabase.from('service_requests').update({assigned_to: assignee}).eq('id', id.data);
  const updatedAt = blank(formData.get('updatedAt'));
  if (updatedAt) query = query.eq('updated_at', updatedAt);
  const {data, error} = await query.select('id');
  revalidate(id.data);
  if (error) return {error: FAILED()};
  if (!data?.length) return {error: CONFLICT()};
  return {success: t('admin.requests.assigned')};
}

export async function bulkUpdate(formData: FormData) {
  const {supabase} = await requireStaff('agent');
  const ids = formData.getAll('ids').map(String).filter((v) => uuid.safeParse(v).success);
  const action = String(formData.get('bulk'));
  const back = String(formData.get('back') ?? '/admin/demandes');
  const target = back.startsWith('/admin/demandes') ? back : '/admin/demandes';
  if (!ids.length) redirect(target);

  const assignee = blank(formData.get('assignee'));
  const toStatus = String(formData.get('status') ?? '');
  // Refuse an action that has nothing to apply rather than silently clearing or skipping rows.
  const invalid =
    (action === 'assign' && !(assignee && uuid.safeParse(assignee).success)) ||
    (action === 'status' && !toStatus) ||
    !['assign', 'unassign', 'status'].includes(action);

  const failures: {id: string; code: string}[] = [];
  if (invalid) {
    failures.push(...ids.map((id) => ({id, code: 'failed'})));
  } else {
    // One update per row so the triggers log every event with its own actor.
    for (const id of ids) {
      if (action === 'assign' || action === 'unassign') {
        const {data, error} = await supabase
          .from('service_requests')
          .update({assigned_to: action === 'assign' ? assignee : null})
          .eq('id', id)
          .select('id');
        if (error || !data?.length) failures.push({id, code: 'failed'});
      } else {
        const code = await applyStatusChange(supabase, id, toStatus, {
          reason: blank(formData.get('reason')),
          lostReason: blank(formData.get('lostReason')),
          expectedUpdatedAt: null,
        });
        if (code) failures.push({id, code});
      }
    }
  }
  revalidate();
  if (failures.length) {
    const url = new URL(target, 'http://local');
    url.searchParams.set('bulkFailed', String(failures.length));
    url.searchParams.set('bulkReason', failures[0].code);
    redirect(`${url.pathname}${url.search}`);
  }
  redirect(target);
}

// ---------------------------------------------------------------------------
// Notes & contact attempts
// ---------------------------------------------------------------------------

const noteSchema = z.object({
  id: uuid,
  body: z.string().trim().min(1).max(4000),
  channel: z.enum(['', ...CHANNELS.map((c) => c.code)] as [string, ...string[]]),
});

async function addNoteImpl(formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const parsed = noteSchema.safeParse({
    id: formData.get('id'),
    body: formData.get('body'),
    channel: formData.get('channel') ?? '',
  });
  if (!parsed.success) return {error: t('admin.requests.note.invalid')};

  const {error} = await supabase.from('request_events').insert({
    request_id: parsed.data.id,
    type: parsed.data.channel ? 'contact_attempt' : 'note',
    channel: (parsed.data.channel || null) as any,
    body: parsed.data.body,
    actor_id: user.id,
  });
  revalidate(parsed.data.id);
  return error ? {error: FAILED()} : {success: t('admin.requests.note.added')};
}

export async function addNote(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await addNoteImpl(formData);
  return result?.error ? {...result, values: submittedValues(formData)} : result;
}

export async function toggleDispute(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: FAILED()};
  const next = formData.get('hasDispute') === 'true';

  let update = supabase.from('service_requests').update({has_dispute: next}).eq('id', id.data);
  const updatedAt = blank(formData.get('updatedAt'));
  if (updatedAt) update = update.eq('updated_at', updatedAt);
  const {data, error} = await update.select('id');
  revalidate(id.data);
  if (error) return {error: FAILED()};
  if (!data?.length) return {error: CONFLICT()};

  const {error: eventError} = await supabase.from('request_events').insert({
    request_id: id.data,
    type: 'field_change',
    body: next ? t('admin.requests.dispute.on') : t('admin.requests.dispute.off'),
    metadata: {field: 'has_dispute', to: next},
    actor_id: user.id,
  });
  // The flag is already changed; say so rather than pretending the click did nothing.
  if (eventError) return {error: t('admin.requests.dispute.audit-failed')};
  return {success: next ? t('admin.requests.dispute.on') : t('admin.requests.dispute.off')};
}

// ---------------------------------------------------------------------------
// Editing request + client fields
// ---------------------------------------------------------------------------

const TRACKED = ['service_type', 'destination_country', 'package_slug'] as const;

async function updateRequestDetailsImpl(formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  const clientId = uuid.safeParse(formData.get('clientId'));
  if (!id.success || !clientId.success) return {error: FAILED()};

  const email = blank(formData.get('email'))?.toLowerCase() ?? null;
  if (email && !z.string().email().safeParse(email).success) return {error: t('admin.requests.invalid-email')};
  const firstName = blank(formData.get('firstName'));
  const lastName = blank(formData.get('lastName'));
  if (!firstName || !lastName) return {error: t('admin.requests.name-required')};
  const phone = blank(formData.get('phone'));
  const origin = blank(formData.get('originCountry'));

  const requestPatch = {
    service_type: String(formData.get('serviceType') ?? ''),
    destination_country: blank(formData.get('destination')),
    package_slug: blank(formData.get('packageSlug')),
    status_reason: blank(formData.get('statusReason')),
  };
  if (!SERVICE_TYPES.some((s) => s.code === requestPatch.service_type)) return {error: FAILED()};

  const {data: before} = await supabase
    .from('service_requests')
    .select('client_id, service_type, destination_country, package_slug, updated_at')
    .eq('id', id.data)
    .maybeSingle();
  if (!before) return {error: FAILED()};
  // The client being edited must be the request's own client, never whatever id the browser sent.
  if (before.client_id !== clientId.data) return {error: FAILED()};

  const expected = blank(formData.get('updatedAt'));
  if (expected && before.updated_at !== expected) return {error: CONFLICT()};

  // Client first: if the email is taken nothing else has been written yet.
  const {error: clientError} = await supabase
    .from('clients')
    .update({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      phone_e164: normalizePhone(phone),
      origin_country: normalizeCountry(origin, ORIGIN_COUNTRIES) ?? origin,
    })
    .eq('id', clientId.data);
  if (clientError) {
    return {error: clientError.code === '23505' ? t('admin.requests.email-taken') : FAILED()};
  }

  // Any edit counts as activity (the stale marker must clear even when only client fields or the reason changed).
  let update = supabase
    .from('service_requests')
    .update({...requestPatch, last_activity_at: new Date().toISOString()})
    .eq('id', id.data);
  if (expected) update = update.eq('updated_at', expected);
  const {data: updated, error} = await update.select('id');
  if (error) return {error: FAILED()};
  if (!updated?.length) return {error: CONFLICT()};

  for (const field of TRACKED) {
    if ((before as any)[field] !== (requestPatch as any)[field]) {
      const {error: eventError} = await supabase.from('request_events').insert({
        request_id: id.data,
        type: 'field_change',
        body: null,
        metadata: {field, from: (before as any)[field], to: (requestPatch as any)[field]},
        actor_id: user.id,
      });
      if (eventError) return {error: t('admin.requests.audit-failed')};
    }
  }
  revalidate(id.data);
  return {success: t('admin.requests.saved')};
}

export async function updateRequestDetails(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await updateRequestDetailsImpl(formData);
  return result?.error ? {...result, values: submittedValues(formData)} : result;
}

// ---------------------------------------------------------------------------
// New request (WhatsApp / phone / office)
// ---------------------------------------------------------------------------

export type NewRequestState = FormState & {matches?: {id: string; first_name: string; last_name: string; email: string | null; phone: string | null}[]};

async function createRequestImpl(formData: FormData): Promise<NewRequestState> {
  const {supabase, user} = await requireStaff('agent');

  const serviceType = String(formData.get('serviceType') ?? '');
  const source = String(formData.get('source') ?? '');
  const initialStatus = String(formData.get('status') ?? 'new');
  const packageSlug = blank(formData.get('packageSlug'));
  if (!SERVICE_TYPES.some((s) => s.code === serviceType)) return {error: t('admin.requests.new.invalid')};
  if (!MANUAL_SOURCES.some((s) => s.code === source)) return {error: t('admin.requests.new.invalid')};
  if (packageSlug && !listPackages().some((p) => p.slug === packageSlug)) return {error: t('admin.requests.new.invalid')};

  // A hand-entered request must start in an open, active status (never already won or lost).
  const {data: statusRow} = await supabase.from('request_statuses').select('stage, is_active').eq('code', initialStatus).maybeSingle();
  if (!statusRow || statusRow.stage !== 'open' || !statusRow.is_active) return {error: t('admin.requests.new.invalid')};

  let clientId = blank(formData.get('clientId'));
  let createdClientId: string | null = null;
  if (clientId && !uuid.safeParse(clientId).success) return {error: t('admin.requests.new.invalid')};

  if (!clientId) {
    const firstName = blank(formData.get('firstName'));
    const lastName = blank(formData.get('lastName'));
    const email = blank(formData.get('email'))?.toLowerCase() ?? null;
    const phone = blank(formData.get('phone'));
    if (!firstName || !lastName) return {error: t('admin.requests.name-required')};
    if (!email && !phone) return {error: t('admin.requests.new.contact-required')};
    if (email && !z.string().email().safeParse(email).success) return {error: t('admin.requests.invalid-email')};

    const phoneE164 = normalizePhone(phone);
    const matches = await findClientMatches(supabase, email, phoneE164);
    if (matches.length && formData.get('forceNew') !== 'true') {
      return {error: t('admin.requests.new.duplicate'), matches};
    }

    const origin = blank(formData.get('originCountry'));
    const {data: client, error} = await supabase
      .from('clients')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        phone_e164: phoneE164,
        origin_country: normalizeCountry(origin, ORIGIN_COUNTRIES) ?? origin,
      })
      .select('id')
      .single();
    if (error || !client) {
      return {error: error?.code === '23505' ? t('admin.requests.email-taken') : FAILED()};
    }
    clientId = client.id;
    createdClientId = client.id;
  }

  // Best effort: do not leave behind a client the agent did not mean to keep.
  const discardCreatedClient = async () => {
    if (createdClientId) await supabase.from('clients').delete().eq('id', createdClientId);
  };

  // The price the client would be quoted today (never taken from the browser).
  const {data: quoted, error: priceError} = await supabase.rpc('resolve_price', {p_service_type: serviceType, p_package_slug: packageSlug ?? undefined});
  if (priceError) {
    await discardCreatedClient();
    return {error: FAILED()};
  }

  const {data: request, error} = await supabase
    .from('service_requests')
    .insert({
      client_id: clientId!,
      quoted_price_cents: quoted ?? null,
      service_type: serviceType,
      destination_country: normalizeCountry(blank(formData.get('destination')), DESTINATION_COUNTRIES) ?? blank(formData.get('destination')),
      package_slug: packageSlug,
      source: source as any,
      status: initialStatus,
    })
    .select('id')
    .single();
  if (error || !request) {
    await discardCreatedClient();
    return {error: FAILED()};
  }

  const note = blank(formData.get('note'));
  if (note) {
    await supabase.from('request_events').insert({request_id: request.id, type: 'note', body: note, actor_id: user.id});
  }
  revalidate();
  redirect(`/admin/demandes/${request.id}`);
}

export async function createRequest(_prev: NewRequestState, formData: FormData): Promise<NewRequestState> {
  const result = await createRequestImpl(formData);
  return result?.error ? {...result, values: submittedValues(formData)} : result;
}
