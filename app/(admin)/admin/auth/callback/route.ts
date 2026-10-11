import {NextResponse, type NextRequest} from 'next/server';
import type {EmailOtpType} from '@supabase/supabase-js';

import {createSupabaseServerClient} from '@/lib/admin/db/server';
import {isAdminConfigured} from '@/lib/admin/env';
import {getRequestOrigin} from '@/lib/admin/origin';
import {safeAdminPath} from '@/lib/admin/safe-redirect';

const OTP_TYPES: EmailOtpType[] = ['invite', 'recovery', 'magiclink', 'email', 'signup', 'email_change'];

// Landing point for the links in Supabase auth emails (invitation, password reset).
export async function GET(request: NextRequest) {
  const origin = await getRequestOrigin();
  const params = request.nextUrl.searchParams;
  const next = safeAdminPath(params.get('next'), '/admin/mot-de-passe');
  const failure = NextResponse.redirect(new URL('/admin/login?erreur=lien', origin));
  if (!isAdminConfigured()) return failure;

  const supabase = await createSupabaseServerClient();
  const tokenHash = params.get('token_hash');
  const type = params.get('type') as EmailOtpType | null;
  const code = params.get('code');

  let ok = false;
  if (tokenHash && type && OTP_TYPES.includes(type)) {
    ok = !(await supabase.auth.verifyOtp({type, token_hash: tokenHash})).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }
  return ok ? NextResponse.redirect(new URL(next, origin)) : failure;
}
