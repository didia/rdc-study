'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import {z} from 'zod';

import {PRICES_TAG} from '../../prices';
import {requireStaff} from '../auth';
import {t} from '../i18n';
import type {FormState} from '../form-state';
import {submittedValues} from '../form-state';
import {dollarsToCents, PRICED_SERVICES, SCOPE_PATTERN} from '../price-scopes';

const schema = z.object({
  serviceType: z.enum(PRICED_SERVICES.map((s) => s.code) as [string, ...string[]]),
  scope: z.string().regex(SCOPE_PATTERN),
  reason: z.string().trim().min(3).max(300),
});

function refreshPublicPrices() {
  revalidateTag(PRICES_TAG);
  for (const path of ['/', '/nos-services', '/assistance-process', '/admin/tarifs']) revalidatePath(path);
}

async function savePriceImpl(formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const parsed = schema.safeParse({
    serviceType: formData.get('serviceType'),
    scope: formData.get('scope'),
    reason: formData.get('reason'),
  });
  if (!parsed.success) return {error: t('admin.prices.invalid')};
  const cents = dollarsToCents(String(formData.get('amount') ?? ''));
  if (cents === null) return {error: t('admin.prices.invalid-amount')};

  const service = PRICED_SERVICES.find((s) => s.code === parsed.data.serviceType)!;
  if ('locked' in service && service.locked && cents !== 0) return {error: t('admin.prices.locked')};
  if (parsed.data.scope !== '*' && !service.allowExceptions) return {error: t('admin.prices.no-exceptions')};

  const {error} = await supabase.rpc('set_service_price', {
    p_service_type: parsed.data.serviceType,
    p_scope: parsed.data.scope,
    p_amount_cents: cents,
    p_reason: parsed.data.reason,
  });
  if (error) return {error: t('admin.requests.failed')};
  refreshPublicPrices();
  return {success: t('admin.prices.saved')};
}

export async function savePrice(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await savePriceImpl(formData);
  return result?.error ? {...result, values: submittedValues(formData)} : result;
}

export async function removePriceException(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase} = await requireStaff('admin');
  const parsed = schema.safeParse({
    serviceType: formData.get('serviceType'),
    scope: formData.get('scope'),
    reason: formData.get('reason'),
  });
  if (!parsed.success || parsed.data.scope === '*') return {error: t('admin.prices.invalid')};

  const {error} = await supabase.rpc('remove_service_price', {
    p_service_type: parsed.data.serviceType,
    p_scope: parsed.data.scope,
    p_reason: parsed.data.reason,
  });
  if (error) return {error: t('admin.requests.failed')};
  refreshPublicPrices();
  return {success: t('admin.prices.removed')};
}
