import * as Sentry from '@sentry/nextjs';
import {NextResponse, type NextRequest} from 'next/server';

import {createSupabaseServiceClient} from '@/lib/admin/db/server';
import {runDigest} from '@/lib/admin/digest-run';
import {isAdminConfigured} from '@/lib/admin/env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Daily digest, called by the scheduled function (netlify/functions/daily-digest.mts) with the shared secret.
// Any failure answers 500 so the scheduled run is visibly red instead of reporting an empty send.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return new NextResponse('Unauthorized', {status: 401});
  if (!isAdminConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ok: true, sent: 0, skipped: 'not configured'});

  try {
    const {sent, failed} = await runDigest(createSupabaseServiceClient());
    return NextResponse.json({ok: failed === 0, sent, failed}, {status: failed === 0 ? 200 : 500});
  } catch (error) {
    Sentry.captureException(error, {tags: {area: 'notifications'}});
    return NextResponse.json({ok: false, error: 'digest_failed'}, {status: 500});
  }
}
