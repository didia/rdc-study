#!/usr/bin/env node
// Copies every object of the private `request-docs` bucket into a local directory (for the weekly backup job).
//   node scripts/backup-storage.mjs <output-dir>
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. When EXPECTED_OBJECT_COUNT is set (the workflow passes
// `select count(*) from storage.objects where bucket_id = 'request-docs'`), the job fails if fewer files were copied.
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

import {createClient} from '@supabase/supabase-js';

const out = process.argv[2];
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!out || !url || !key) {
  console.error('Usage: backup-storage.mjs <output-dir> (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required)');
  process.exit(1);
}

const supabase = createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
const bucket = supabase.storage.from('request-docs');

const PAGE_SIZE = 1000;

// list() returns at most `limit` entries per call, so page with a stable sort until a short page.
async function* walk(prefix = '') {
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const {data, error} = await bucket.list(prefix, {limit: PAGE_SIZE, offset, sortBy: {column: 'name', order: 'asc'}});
    if (error) throw error;
    for (const entry of data ?? []) {
      const full = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) yield* walk(full); // folder
      else yield full;
    }
    if ((data?.length ?? 0) < PAGE_SIZE) return;
  }
}

let count = 0;
for await (const file of walk()) {
  const {data, error} = await bucket.download(file);
  if (error) throw error;
  const target = path.join(out, file);
  await mkdir(path.dirname(target), {recursive: true});
  await writeFile(target, Buffer.from(await data.arrayBuffer()));
  count += 1;
}
console.log(`Backed up ${count} file(s) to ${out}`);

const expected = process.env.EXPECTED_OBJECT_COUNT;
if (expected !== undefined && expected !== '') {
  if (!/^\d+$/.test(expected)) {
    console.error(`EXPECTED_OBJECT_COUNT is not a number: "${expected}"`);
    process.exit(1);
  }
  // Fewer files than storage.objects means documents were skipped; a few more is just uploads made during the run.
  if (count < Number(expected)) {
    console.error(`Incomplete copy: ${count} file(s) downloaded but storage.objects has ${expected}`);
    process.exit(1);
  }
}
