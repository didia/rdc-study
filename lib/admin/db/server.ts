import 'server-only';
import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';

import {getServiceRoleKey, getSupabasePublicConfig} from '../env';
import type {Database} from './types';

// Client acting as the signed-in staff member: Row Level Security is the enforcement point.
export async function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  if (!config) throw new Error('Supabase is not configured');
  const store = await cookies();
  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({name, value, options}) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: the middleware refreshes the session instead.
        }
      },
    },
  });
}

// Service-role client: bypasses RLS. Only for staff invitations and the public intake route.
export function createSupabaseServiceClient() {
  const config = getSupabasePublicConfig();
  const key = getServiceRoleKey();
  if (!config || !key) throw new Error('Supabase service role is not configured');
  return createClient<Database>(config.url, key, {
    auth: {persistSession: false, autoRefreshToken: false},
  });
}
