export const DOCUMENT_KINDS = [
  {code: 'contract', label: 'Contrat'},
  {code: 'receipt', label: 'Reçu'},
  {code: 'client_document', label: 'Document du client'},
  {code: 'deliverable', label: 'Livrable'},
  {code: 'other', label: 'Autre'},
] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number]['code'];
export const documentKindLabel = (code: string) => DOCUMENT_KINDS.find((k) => k.code === code)?.label ?? code;

export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

// Must match the bucket's allowed_mime_types (the bucket is the real enforcement; this gives early feedback).
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.text',
];

export function validateUpload(file: {size: number; type: string}): 'too_large' | 'type' | null {
  if (file.size > MAX_DOCUMENT_BYTES) return 'too_large';
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return 'type';
  return null;
}

/** File names end up in storage paths and download headers: keep them boring. */
export function safeFileName(name: string): string {
  const cleaned = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^[-.]+/, '')
    .replace(/-{2,}/g, '-');
  const truncated = cleaned.length > 100 ? cleaned.slice(-100) : cleaned;
  return truncated || 'document';
}

/** Longest file name the registration accepts (schema and column check); longer names keep their extension. */
export const MAX_FILE_NAME_LENGTH = 200;
export function registrationFileName(name: string): string {
  const trimmed = name.trim() || 'document';
  if (trimmed.length <= MAX_FILE_NAME_LENGTH) return trimmed;
  const dot = trimmed.lastIndexOf('.');
  const ext = dot > 0 && trimmed.length - dot <= 12 ? trimmed.slice(dot) : '';
  return trimmed.slice(0, MAX_FILE_NAME_LENGTH - ext.length) + ext;
}

/** A receipt acknowledges money received by the agency: not for cancelled payments, and not for refunds (money paid out). */
export function receiptBlocker(payment: {voided_at?: string | null; kind: string}): 'voided' | 'refund' | null {
  if (payment.voided_at) return 'voided';
  if (payment.kind === 'refund') return 'refund';
  return null;
}

export const documentPath = (requestId: string, uuid: string, fileName: string) => `request/${requestId}/${uuid}-${safeFileName(fileName)}`;
