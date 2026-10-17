import {NextResponse, type NextRequest} from 'next/server';

import {getStaffContext} from '@/lib/admin/auth';
import {createSupabaseServiceClient} from '@/lib/admin/db/server';

export const dynamic = 'force-dynamic';

const LINK_LIFETIME_SECONDS = 24 * 60 * 60;

// Subject-access export of one client's data (admin only). The database function checks the role and records
// the export itself, so no caller can read the data without leaving an audit row.
export async function GET(_request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const ctx = await getStaffContext();
  if (ctx.status !== 'ok' || ctx.profile.role !== 'admin' || !/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse('Forbidden', {status: 403});

  const {data, error} = await ctx.supabase.rpc('fn_client_export', {p_client: id});
  if (error) return new NextResponse('Export failed', {status: 500});
  if (!data || !(data as any).client) return new NextResponse('Not found', {status: 404});

  // The files themselves are part of the data: each document gets a short-lived download link.
  const exportData = data as any;
  const documents = (exportData.documents ?? []) as {storage_path: string}[];
  if (documents.length) {
    const {data: signed, error: signError} = await createSupabaseServiceClient()
      .storage.from('request-docs')
      .createSignedUrls(
        documents.map((d) => d.storage_path),
        LINK_LIFETIME_SECONDS,
      );
    if (signError) return new NextResponse('Export failed', {status: 500});
    exportData.documents = documents.map((d, i) => ({...d, download_url: signed?.[i]?.signedUrl ?? null, download_link_expires_in_seconds: LINK_LIFETIME_SECONDS}));
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="client-${id}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
