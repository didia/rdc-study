import {NextRequest} from 'next/server';
import {describe, expect, it, vi} from 'vitest';

// getUser() rotates the session: the Supabase client hands the new cookies to `setAll`.
vi.mock('@supabase/ssr', () => ({
  createServerClient: (_url: string, _key: string, options: any) => ({
    auth: {
      getUser: async () => {
        options.cookies.setAll([{name: 'sb-session', value: 'rotated', options: {}}]);
        return {data: {user: {id: 'u1'}}};
      },
    },
  }),
}));
vi.mock('../env', () => ({getSupabasePublicConfig: () => ({url: 'https://x.supabase.co', anonKey: 'anon'})}));

import {updateSession} from '../db/middleware';

describe('updateSession', () => {
  it('forwards the rotated cookies to the render, not the pre-refresh ones', async () => {
    const request = new NextRequest('https://admin.test/admin/demandes', {headers: {cookie: 'sb-session=stale'}});
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', 'n');

    const response = await updateSession(request, requestHeaders);

    expect(response.headers.get('x-middleware-request-cookie')).toBe('sb-session=rotated');
    expect(response.headers.get('x-middleware-request-x-nonce')).toBe('n');
    expect(response.cookies.get('sb-session')?.value).toBe('rotated');
  });
});
