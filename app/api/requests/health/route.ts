import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

// Uptime probe: no database access, no personal data.
export function GET() {
  return NextResponse.json({ok: true}, {headers: {'Cache-Control': 'no-store'}});
}
