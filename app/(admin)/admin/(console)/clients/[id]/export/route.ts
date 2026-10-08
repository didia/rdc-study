import {NextResponse, type NextRequest} from 'next/server';

import {getStaffContext} from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

// Subject-access export of one client's data (admin only, audited).
export async function GET(_request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const ctx = await getStaffContext();
  if (ctx.status !== 'ok' || ctx.profile.role !== 'admin' || !/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse('Forbidden', {status: 403});

  const {data, error} = await ctx.supabase.rpc('fn_client_export', {p_client: id});
  if (error || !data || !(data as any).client) return new NextResponse('Not found', {status: 404});
  await ctx.supabase.from('audit_events').insert({actor_id: ctx.user.id, type: 'export_client', metadata: {client_id: id}});

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="client-${id}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
