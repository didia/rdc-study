import {NextResponse, type NextRequest} from 'next/server';
import {createServerClient} from '@supabase/ssr';

import {getSupabasePublicConfig} from '../env';
import type {Database} from './types';

const PUBLIC_PATHS = ['/admin/login', '/admin/mot-de-passe-oublie', '/admin/auth/callback', '/admin/acces-refuse'];

// Refreshes the Supabase session cookies and sends anonymous visitors to the login page.
export async function updateSession(request: NextRequest) {
  const config = getSupabasePublicConfig();
  let response = NextResponse.next({request});
  if (!config) return response; // pages show a "console not configured" state

  const supabase = createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({name, value}) => request.cookies.set(name, value));
        response = NextResponse.next({request});
        list.forEach(({name, value, options}) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: {user},
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname.replace(/\/$/, '') || '/admin';
  if (!user && !PUBLIC_PATHS.includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    if (path !== '/admin') url.searchParams.set('next', path + request.nextUrl.search);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }
  return response;
}
