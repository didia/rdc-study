import type {NextRequest} from 'next/server';

import {updateSession} from './lib/admin/db/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
