'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {submittedValues, type FormState} from '../form-state';
import {t} from '../i18n';
import {CURRENCIES, PAYMENT_KINDS, PAYMENT_METHODS} from '../money';
import {dollarsToCents} from '../price-scopes';

const uuid = z.string().uuid();

function refresh(id: string) {
  revalidatePath('/admin/paiements');
  revalidatePath('/admin/demandes');
  revalidatePath(`/admin/demandes/${id}`);
}

const paymentSchema = z.object({
  id: uuid,
  kind: z.enum(PAYMENT_KINDS.map((k) => k.code) as [string, ...string[]]),
  currency: z.enum(CURRENCIES),
  method: z.enum(PAYMENT_METHODS.map((m) => m.code) as [string, ...string[]]),
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  externalRef: z.string().trim().max(120).optional(),
  note: z.string().trim().max(500).optional(),
});

async function recordPaymentImpl(formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const parsed = paymentSchema.safeParse({
    id: formData.get('id'),
    kind: formData.get('kind'),
    currency: formData.get('currency'),
    method: formData.get('method'),
    paidAt: formData.get('paidAt'),
    externalRef: formData.get('externalRef') ?? '',
    note: formData.get('note') ?? '',
  });
  if (!parsed.success) return {error: t('admin.payments.invalid')};
  const cents = dollarsToCents(String(formData.get('amount') ?? ''));
  if (cents === null || cents === 0) return {error: t('admin.prices.invalid-amount')};

  const paidAt = new Date(`${parsed.data.paidAt}T12:00:00`);
  if (Number.isNaN(paidAt.getTime()) || paidAt.getTime() > Date.now() + 36 * 3_600_000) return {error: t('admin.payments.future')};

  const {error} = await supabase.from('payments').insert({
    request_id: parsed.data.id,
    kind: parsed.data.kind,
    amount_cents: cents,
    currency: parsed.data.currency,
    method: parsed.data.method,
    external_ref: parsed.data.externalRef || null,
    paid_at: paidAt.toISOString(),
    recorded_by: user.id,
    note: parsed.data.note || null,
  });
  refresh(parsed.data.id);
  return error ? {error: t('admin.requests.failed')} : {success: t('admin.payments.recorded')};
}

export async function recordPayment(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await recordPaymentImpl(formData);
  return result?.error ? {...result, values: submittedValues(formData)} : result;
}

export async function voidPayment(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const id = uuid.safeParse(formData.get('paymentId'));
  const requestId = uuid.safeParse(formData.get('id'));
  const reason = z.string().trim().min(3).max(300).safeParse(formData.get('reason'));
  if (!id.success || !requestId.success || !reason.success) return {error: t('admin.payments.void-needs-reason')};

  const {data, error} = await supabase
    .from('payments')
    .update({voided_at: new Date().toISOString(), void_reason: reason.data})
    .eq('id', id.data)
    .is('voided_at', null)
    .select('id');
  refresh(requestId.data);
  if (error || !data?.length) return {error: t('admin.requests.failed')};
  return {success: t('admin.payments.voided')};
}

// Agreed price: defaults to what was quoted at submission; any override needs a reason (kept in the timeline).
export async function setAgreedPrice(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.requests.failed')};
  const currency = z.enum(CURRENCIES).safeParse(formData.get('currency') ?? 'USD');
  if (!currency.success) return {error: t('admin.payments.invalid')};

  const raw = String(formData.get('amount') ?? '').trim();
  const cents = raw === '' ? null : dollarsToCents(raw);
  if (raw !== '' && cents === null) return {error: t('admin.prices.invalid-amount')};
  const reason = String(formData.get('reason') ?? '').trim();

  const {data: before} = await supabase
    .from('service_requests')
    .select('agreed_price_cents, agreed_currency, quoted_price_cents')
    .eq('id', id.data)
    .maybeSingle();
  if (!before) return {error: t('admin.requests.failed')};
  if (cents !== null && cents !== before.quoted_price_cents && reason.length < 3) return {error: t('admin.payments.override-needs-reason')};

  const {error} = await supabase
    .from('service_requests')
    .update({agreed_price_cents: cents, agreed_currency: currency.data})
    .eq('id', id.data);
  if (error) return {error: t('admin.requests.failed')};
  await supabase.from('request_events').insert({
    request_id: id.data,
    type: 'field_change',
    body: reason || null,
    metadata: {field: 'agreed_price', from: before.agreed_price_cents ?? before.quoted_price_cents, to: cents ?? before.quoted_price_cents},
    actor_id: user.id,
  });
  refresh(id.data);
  return {success: t('admin.payments.agreed-saved')};
}
