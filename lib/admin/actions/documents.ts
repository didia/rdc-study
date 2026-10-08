'use server';

import {randomUUID} from 'crypto';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {packageLabel} from '../catalogue';
import {DOCUMENT_KINDS, documentPath} from '../documents';
import type {FormState} from '../form-state';
import {submittedValues} from '../form-state';
import {t} from '../i18n';
import {formatDate} from '../format';
import {kindLabel, methodLabel, effectivePrice} from '../money';
import {contractVariables, documentParagraphs, receiptVariables, renderPdf, type ContractData} from '../pdf';
import {defaultPaymentInstructions} from '../templates';
import {serviceLabel} from '../vocab';

const uuid = z.string().uuid();
const BUCKET = 'request-docs';

const registerSchema = z.object({
  requestId: uuid,
  kind: z.enum(DOCUMENT_KINDS.map((k) => k.code) as [string, ...string[]]),
  path: z.string().max(400),
  fileName: z.string().min(1).max(200),
  mimeType: z.string().max(120).optional(),
  size: z.number().int().min(0).max(10 * 1024 * 1024),
});

function refresh(requestId: string) {
  revalidatePath(`/admin/demandes/${requestId}`);
}

// The browser uploads straight to the private bucket (RLS decides who may); this records the document.
export async function registerDocument(input: z.infer<typeof registerSchema>): Promise<{error?: string}> {
  const {supabase, user} = await requireStaff('agent');
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return {error: t('admin.documents.invalid')};
  const {requestId, path} = parsed.data;
  if (!path.startsWith(`request/${requestId}/`)) return {error: t('admin.documents.invalid')};

  const {error} = await supabase.from('request_documents').insert({
    request_id: requestId,
    kind: parsed.data.kind,
    storage_path: path,
    file_name: parsed.data.fileName,
    mime_type: parsed.data.mimeType ?? null,
    size_bytes: parsed.data.size,
    uploaded_by: user.id,
  });
  refresh(requestId);
  return error ? {error: t('admin.documents.register-failed')} : {};
}

// Short-lived signed URL, minted with the caller's own rights: no document row they can see, no URL.
export async function getDocumentUrl(documentId: string): Promise<{url?: string; error?: string}> {
  const {supabase} = await requireStaff('agent');
  if (!uuid.safeParse(documentId).success) return {error: t('admin.documents.invalid')};
  const {data: doc} = await supabase.from('request_documents').select('storage_path, file_name').eq('id', documentId).maybeSingle();
  if (!doc) return {error: t('admin.documents.not-found')};
  const {data, error} = await supabase.storage.from(BUCKET).createSignedUrl(doc.storage_path, 60, {download: doc.file_name});
  if (error || !data) return {error: t('admin.documents.not-found')};
  return {url: data.signedUrl};
}

async function storePdf(
  ctx: Awaited<ReturnType<typeof requireStaff>>,
  requestId: string,
  kind: 'contract' | 'receipt',
  fileName: string,
  bytes: Uint8Array,
): Promise<string | null> {
  const path = documentPath(requestId, randomUUID(), fileName);
  const {error: uploadError} = await ctx.supabase.storage.from(BUCKET).upload(path, bytes, {contentType: 'application/pdf'});
  if (uploadError) return t('admin.documents.upload-failed');
  const {error} = await ctx.supabase.from('request_documents').insert({
    request_id: requestId,
    kind,
    storage_path: path,
    file_name: fileName,
    mime_type: 'application/pdf',
    size_bytes: bytes.length,
    uploaded_by: ctx.user.id,
  });
  return error ? t('admin.documents.register-failed') : null;
}

const today = () => formatDate(new Date().toISOString());

// Contract: filled from the request, the client, the agreed price and the *latest* template version.
export async function generateContract(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireStaff('agent');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return {error: t('admin.documents.invalid')};
  const {supabase} = ctx;

  const [{data: request}, {data: template}, {data: deposit}] = await Promise.all([
    supabase.from('service_requests').select('*, client:clients(*)').eq('id', id.data).maybeSingle(),
    supabase.from('document_templates').select('*').eq('kind', 'contract').order('version', {ascending: false}).limit(1).maybeSingle(),
    supabase.from('app_settings').select('value').eq('key', 'deposit_share').maybeSingle(),
  ]);
  if (!request || !template) return {error: t('admin.documents.not-found')};
  const price = effectivePrice(request as any);
  if (price == null) return {error: t('admin.documents.no-price')};

  const client = (request as any).client;
  const data: ContractData = {
    clientName: `${client.first_name} ${client.last_name}`,
    clientAddress: client.address,
    packageLabel: request.package_slug ? packageLabel(request.package_slug) : serviceLabel(request.service_type),
    reference: request.reference,
    priceCents: price,
    currency: request.agreed_currency,
    depositShare: Number(deposit?.value ?? 0.5),
    paymentInstructions: defaultPaymentInstructions(),
    date: today(),
  };
  const bytes = await renderPdf({
    title: template.title,
    subtitle: `${data.reference} - ${data.clientName}`,
    paragraphs: documentParagraphs(template.body, contractVariables(data)),
    footer: `RDC Etudes - ${data.reference} - contrat v${template.version}`,
  });
  const error = await storePdf(ctx, id.data, 'contract', `Contrat-${request.reference}-v${template.version}.pdf`, bytes);
  refresh(id.data);
  return error ? {error} : {success: t('admin.documents.generated')};
}

export async function generateReceipt(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireStaff('agent');
  const requestId = uuid.safeParse(formData.get('id'));
  const paymentId = uuid.safeParse(formData.get('paymentId'));
  if (!requestId.success || !paymentId.success) return {error: t('admin.documents.invalid')};
  const {supabase} = ctx;

  const [{data: payment}, {data: request}, {data: template}] = await Promise.all([
    supabase.from('payments').select('*').eq('id', paymentId.data).eq('request_id', requestId.data).maybeSingle(),
    supabase.from('service_requests').select('*, client:clients(*)').eq('id', requestId.data).maybeSingle(),
    supabase.from('document_templates').select('*').eq('kind', 'receipt').order('version', {ascending: false}).limit(1).maybeSingle(),
  ]);
  if (!payment || !request || !template) return {error: t('admin.documents.not-found')};
  if (payment.voided_at) return {error: t('admin.documents.voided-payment')};

  const client = (request as any).client;
  const vars = receiptVariables({
    clientName: `${client.first_name} ${client.last_name}`,
    packageLabel: request.package_slug ? packageLabel(request.package_slug) : serviceLabel(request.service_type),
    reference: request.reference,
    amountCents: payment.amount_cents,
    currency: payment.currency,
    kindLabel: kindLabel(payment.kind),
    methodLabel: methodLabel(payment.method),
    externalRef: payment.external_ref,
    paidDate: formatDate(payment.paid_at),
    date: today(),
  });
  const bytes = await renderPdf({
    title: template.title,
    subtitle: `${request.reference} - ${vars.client_name}`,
    paragraphs: documentParagraphs(template.body, vars),
    footer: `RDC Etudes - ${request.reference} - recu v${template.version}`,
  });
  const error = await storePdf(ctx, requestId.data, 'receipt', `Recu-${request.reference}-${payment.paid_at.slice(0, 10)}.pdf`, bytes);
  refresh(requestId.data);
  return error ? {error} : {success: t('admin.documents.generated')};
}

const templateSchema = z.object({
  kind: z.enum(['contract', 'receipt']),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(20).max(8000),
});

// Editing a template adds a version: PDFs already generated keep the text they were generated with.
export async function saveDocumentTemplate(_prev: FormState, formData: FormData): Promise<FormState> {
  const {supabase, user} = await requireStaff('admin');
  const parsed = templateSchema.safeParse({kind: formData.get('kind'), title: formData.get('title'), body: formData.get('body')});
  if (!parsed.success) return {error: t('admin.settings.invalid'), values: submittedValues(formData)};
  const {data: last} = await supabase.from('document_templates').select('version').eq('kind', parsed.data.kind).order('version', {ascending: false}).limit(1);
  const {error} = await supabase.from('document_templates').insert({
    kind: parsed.data.kind,
    version: (last?.[0]?.version ?? 0) + 1,
    title: parsed.data.title,
    body: parsed.data.body,
    created_by: user.id,
  });
  revalidatePath('/admin/modeles');
  return error ? {error: t('admin.requests.failed'), values: submittedValues(formData)} : {success: t('admin.documents.template-saved')};
}
