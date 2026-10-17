// Content-Security-Policy for the private console. Scripts need a per-request nonce (set by middleware.ts);
// Next.js reads it from the request's CSP header and applies it to its own scripts. Styles stay 'unsafe-inline'
// (React inline style attributes); everything else is locked to self plus Supabase and Sentry.
export function buildAdminCsp(nonce: string, env: {supabaseUrl?: string; dev?: boolean}): string {
  const supabase = env.supabaseUrl ? new URL(env.supabaseUrl).origin : '';
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${env.dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    `connect-src 'self' ${supabase} https://*.supabase.co https://*.ingest.sentry.io https://*.ingest.us.sentry.io${env.dev ? ' ws:' : ''}`.replace(/\s+/g, ' ').trim(),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}

export function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
