'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';

import {requireStaff} from '../auth';
import {parseListParams} from '../list-params';

const nameSchema = z.string().trim().min(1).max(80);

export async function saveView(formData: FormData) {
  const {supabase, user} = await requireStaff();
  const name = nameSchema.safeParse(formData.get('name'));
  const requested = String(formData.get('back') ?? '/admin/demandes');
  const back = requested.startsWith('/admin/demandes') ? requested : '/admin/demandes';
  if (!name.success) redirect(back);

  // Re-parse the query string: only known filters are stored.
  const query = new URLSearchParams(back.split('?')[1] ?? '');
  const params = parseListParams(Object.fromEntries(query.entries()));
  const {page: _page, ...stored} = params;
  const {error} = await supabase.from('saved_views').insert({
    owner_id: user.id,
    name: name.data,
    params: stored,
    shared: formData.get('shared') === 'on',
  });
  if (error) throw new Error(`saveView: ${error.message}`);
  revalidatePath('/admin/demandes');
  redirect(back);
}

export async function deleteView(formData: FormData) {
  const {supabase} = await requireStaff();
  const id = z.string().uuid().safeParse(formData.get('id'));
  if (id.success) {
    const {error} = await supabase.from('saved_views').delete().eq('id', id.data);
    if (error) throw new Error(`deleteView: ${error.message}`);
  }
  revalidatePath('/admin/demandes');
  redirect('/admin/demandes');
}
