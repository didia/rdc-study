import 'server-only';

import * as Sentry from '@sentry/nextjs';

import {createSupabaseServiceClient} from './db/server';

type Client = ReturnType<typeof createSupabaseServiceClient>;
type Db = {rpc: Client['rpc']; from: Client['from']; storage: Client['storage']};

export async function getRetentionSettings(db: Pick<Db, 'from'>) {
  const {data} = await db.from('app_settings').select('key, value').in('key', ['retention_months', 'retention_auto']);
  const months = Number(data?.find((s) => s.key === 'retention_months')?.value ?? 24);
  return {months: Number.isFinite(months) && months >= 1 ? months : 24, auto: data?.find((s) => s.key === 'retention_auto')?.value === true};
}

/** Anonymise one client and delete their stored files. Returns the number of files removed. */
export async function anonymiseClientAndFiles(db: Db, clientId: string, reason: string): Promise<number> {
  const {data: paths, error} = await db.rpc('anonymise_client', {p_client: clientId, p_reason: reason});
  if (error) throw error;
  const files = (paths ?? []) as string[];
  if (files.length) {
    // Rows are already gone (the files are unreachable); a failure here only leaves orphans for the next sweep.
    const {error: removeError} = await db.storage.from('request-docs').remove(files);
    if (removeError) Sentry.captureException(removeError, {tags: {area: 'retention'}});
  }
  return files.length;
}

export async function runRetention(db: Db, months: number): Promise<{anonymised: number; files: number}> {
  const {data} = await db.rpc('fn_retention_candidates', {p_months: months});
  let files = 0;
  for (const candidate of data ?? []) files += await anonymiseClientAndFiles(db, candidate.client_id, `retention_${months}m`);
  return {anonymised: (data ?? []).length, files};
}
