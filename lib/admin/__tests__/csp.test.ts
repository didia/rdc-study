import {describe, expect, it} from 'vitest';

import {buildAdminCsp, newNonce} from '../csp';

describe('admin CSP', () => {
  it('requires the nonce for scripts and never allows unsafe-inline scripts in production', () => {
    const csp = buildAdminCsp('abc123', {supabaseUrl: 'https://x.supabase.co'});
    expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).not.toMatch(/script-src[^;]*unsafe-eval/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it('only opens eval and websockets in development, and allows the configured Supabase origin', () => {
    const dev = buildAdminCsp('n', {supabaseUrl: 'http://127.0.0.1:56321/', dev: true});
    expect(dev).toContain("'unsafe-eval'");
    expect(dev).toContain('http://127.0.0.1:56321');
    expect(dev).toContain(' ws:');
  });

  it('generates distinct unguessable nonces', () => {
    const a = newNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/=]{20,}$/);
    expect(newNonce()).not.toBe(a);
  });
});
