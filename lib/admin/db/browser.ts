import {createBrowserClient} from '@supabase/ssr';

import {getSupabasePublicConfig} from '../env';
import type {Database} from './types';

export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();
  if (!config) throw new Error('Supabase is not configured');
  return createBrowserClient<Database>(config.url, config.anonKey);
}
