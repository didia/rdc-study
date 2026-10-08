import {createHash} from 'crypto';
import {NextResponse, type NextRequest} from 'next/server';
import * as Sentry from '@sentry/nextjs';

import {listPackages} from '@/lib/admin/catalogue';
import {createSupabaseServiceClient} from '@/lib/admin/db/server';
import {isAdminConfigured} from '@/lib/admin/env';
import {buildSubmission, intakeSchema} from '@/lib/admin/intake';
import {notifyNewRequest} from '@/lib/admin/notify';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT = Number(process.env.INTAKE_RATE_LIMIT ?? 10); // requests per IP per hour
const RATE_WINDOW_SECONDS = 3600;

const allowedOrigins = () =>
  [process.env.NEXT_PUBLIC_SITE_URL, 'https://www.rdcetudes.com', 'https://rdcetudes.com']
    .filter(Boolean)
    .map((o) => new URL(o as string).origin);

function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {Vary: 'Origin'};
  if (origin && (allowedOrigins().includes(origin) || origin === request.nextUrl.origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return headers;
}

const json = (request: NextRequest, body: unknown, status: number) =>
  NextResponse.json(body, {status, headers: corsHeaders(request)});

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {status: 204, headers: corsHeaders(request)});
}

function clientKey(request: NextRequest): string {
  const ip = (request.headers.get('x-nf-client-connection-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown')
    .split(',')[0]
    .trim();
  // Hashed with a server secret: raw addresses are never stored.
  return createHash('sha256').update(`${ip}:${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`).digest('hex').slice(0, 32);
}

async function turnstileOk(token: string | undefined, request: NextRequest): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // optional hardening
  if (!token) return false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({secret, response: token, remoteip: request.headers.get('x-forwarded-for') ?? ''}),
    });
    return Boolean((await response.json()).success);
  } catch {
    return false;
  }
}

// Public intake for the assistance form. Never throws to the browser: 422 on validation, 503 when storage fails
// (the form keeps working through the legacy email path either way).
export async function POST(request: NextRequest) {
  // Kill switch / unconfigured environment: the form falls back to the legacy email only.
  if (process.env.ADMIN_INTAKE_ENABLED === 'false' || !isAdminConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new NextResponse(null, {status: 204, headers: corsHeaders(request)});
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return json(request, {error: 'too_large'}, 413);

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return json(request, {error: 'invalid_json'}, 422);
  }

  const parsed = intakeSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return json(
      request,
      {error: 'validation', fields: parsed.error.issues.map((i) => ({field: i.path.join('.'), message: i.message}))},
      422,
    );
  }
  const body = parsed.data;

  // Honeypot: pretend success so bots learn nothing.
  if (body.website) return json(request, {ok: true}, 202);

  const built = buildSubmission(body, listPackages().map((p) => p.slug));
  if ('issues' in built) return json(request, {error: 'validation', fields: built.issues}, 422);

  if (!(await turnstileOk(body.turnstileToken, request))) return json(request, {error: 'captcha'}, 422);

  try {
    const supabase = createSupabaseServiceClient();
    const {data: allowed, error: limitError} = await supabase.rpc('check_rate_limit', {
      p_key: clientKey(request),
      p_limit: RATE_LIMIT,
      p_window_seconds: RATE_WINDOW_SECONDS,
    });
    if (limitError) throw limitError;
    if (allowed === false) return json(request, {error: 'rate_limited'}, 429);

    const {data, error} = await supabase.rpc('submit_service_request', {payload: built.payload as any});
    if (error) throw error;
    const result = data as {id: string; reference: string; duplicate: boolean};
    // Best effort and after the write: a mail failure never costs a lead.
    if (!result.duplicate) await notifyNewRequest(result.id).catch((error) => Sentry.captureException(error, {tags: {area: 'notifications'}}));
    return json(request, {ok: true, reference: result.reference, duplicate: result.duplicate}, 200);
  } catch (error) {
    Sentry.captureException(error, {tags: {area: 'intake'}});
    return json(request, {error: 'storage_unavailable'}, 503);
  }
}
