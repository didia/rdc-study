import {t} from './i18n';

export type StatusError = 'invalid' | 'reopen' | 'failed' | 'conflict';

export const STATUS_ERRORS: Record<StatusError, () => string> = {
  invalid: () => t('admin.requests.status.invalid'),
  reopen: () => t('admin.requests.status.reopen-needs-reason'),
  failed: () => t('admin.requests.failed'),
  conflict: () => t('admin.requests.conflict'),
};

/** Message for a status-error code carried in the bulk redirect; unknown codes fall back to the generic failure. */
export const bulkReasonMessage = (code: string | undefined) =>
  code && code in STATUS_ERRORS ? STATUS_ERRORS[code as StatusError]() : t('admin.requests.failed');
