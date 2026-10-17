import type {NextRequest} from 'next/server';

import {buildAdminCsp, newNonce} from './lib/admin/csp';
import {updateSession} from './lib/admin/db/middleware';

export async function middleware(request: NextRequest) {
  const nonce = newNonce();
  const csp = buildAdminCsp(nonce, {supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL, dev: process.env.NODE_ENV !== 'production'});

  // Next.js applies the nonce to its scripts when the *request* carries the CSP header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = await updateSession(request, requestHeaders);
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

