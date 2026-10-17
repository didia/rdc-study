import 'server-only';

import * as Sentry from '@sentry/nextjs';

import {createSupabaseServiceClient} from './db/server';

type Client = ReturnType<typeof createSupabaseServiceClient>;
type Db = {rpc: Client['rpc']; from: Client['from']; storage: Client['storage']};

export type StorageDrain = {removed: number; failed: number};
export type RetentionResult = {anonymised: number; skipped: number; failed: number; files: number; filesFailed: number};

export async function getRetentionSettings(db: Pick<Db, 'from'>) {
  const {data} = await db.from('app_settings').select('key, value').in('key', ['retention_months', 'retention_auto']);
  const months = Number(data?.find((s) => s.key === 'retention_months')?.value ?? 24);
  return {months: Number.isFinite(months) && months >= 1 ? months : 24, auto: data?.find((s) => s.key === 'retention_auto')?.value === true};
}

/**
 * Delete the files of anonymised clients. Their paths are queued in the database in the same transaction that removes
 * the document rows, and leave the queue only once the bucket confirms the delete: a failure here is retried by the
 * next call (the next sweep, or the next manual anonymisation).
 */
export async function drainStorageQueue(db: Db): Promise<StorageDrain> {
  const {data, error} = await db.rpc('fn_storage_delete_queue');
  if (error) throw error;
  const paths = (data ?? []) as string[];
  if (paths.length === 0) return {removed: 0, failed: 0};
  const {error: removeError} = await db.storage.from('request-docs').remove(paths);
  if (removeError) {
    Sentry.captureException(removeError, {tags: {area: 'retention'}});
    return {removed: 0, failed: paths.length};
  }
  const {error: ackError} = await db.rpc('ack_storage_deletes', {p_paths: paths});
  // The files are gone; a missing acknowledgement only means the next drain removes nothing and clears the queue.
  if (ackError) Sentry.captureException(ackError, {tags: {area: 'retention'}});
  return {removed: paths.length, failed: 0};
}

/** Anonymise one client, then delete their stored files. Throws when the database refuses; reports files left behind. */
export async function anonymiseClientAndFiles(db: Db, clientId: string, reason: string): Promise<StorageDrain> {
  const {error} = await db.rpc('anonymise_client', {p_client: clientId, p_reason: reason});
  if (error) throw error;
  return drainStorageQueue(db);
}

export async function runRetention(db: Db, months: number): Promise<RetentionResult> {
  const {data, error} = await db.rpc('fn_retention_candidates', {p_months: months});
  // A failed read is not "nobody to anonymise": it must not be recorded as a clean month.
  if (error) throw error;
  const result: RetentionResult = {anonymised: 0, skipped: 0, failed: 0, files: 0, filesFailed: 0};
  for (const candidate of data ?? []) {
    const {error: rpcError} = await db.rpc('anonymise_client', {p_client: candidate.client_id, p_reason: `retention_${months}m`});
    if (!rpcError) result.anonymised += 1;
    // A request arrived since the list was read: the client is no longer a candidate.
    else if (rpcError.message.includes('open request')) result.skipped += 1;
    else {
      Sentry.captureException(rpcError, {tags: {area: 'retention'}});
      result.failed += 1;
    }
  }
  // Also retries the files that earlier runs could not delete.
  const drained = await drainStorageQueue(db);
  result.files = drained.removed;
  result.filesFailed = drained.failed;
  return result;
}

export function retentionFailed(result: RetentionResult) {
  return result.failed > 0 || result.filesFailed > 0;
}
