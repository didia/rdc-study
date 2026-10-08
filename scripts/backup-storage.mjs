#!/usr/bin/env node
// Copies every object of the private `request-docs` bucket into a local directory (for the weekly backup job).
//   node scripts/backup-storage.mjs <output-dir>
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
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

async function* walk(prefix = '') {
  const {data, error} = await bucket.list(prefix, {limit: 1000});
  if (error) throw error;
  for (const entry of data ?? []) {
    const full = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.id === null) yield* walk(full); // folder
    else yield full;
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
