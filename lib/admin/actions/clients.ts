'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';

import {requireStaff} from '../auth';

const ids = z.object({keep: z.string().uuid(), drop: z.string().uuid()});

// Merging is destructive: it only happens from the confirmation page, with the box ticked.
export async function mergeClientsAction(formData: FormData) {
  const {supabase} = await requireStaff('agent');
  const parsed = ids.safeParse({keep: formData.get('keep'), drop: formData.get('drop')});
  if (!parsed.success) redirect('/admin/clients/doublons');
  if (formData.get('confirm') !== 'yes') {
    redirect(`/admin/clients/fusion?keep=${parsed.data.keep}&drop=${parsed.data.drop}&erreur=confirmation`);
  }
  const {error} = await supabase.rpc('merge_clients', {p_keep: parsed.data.keep, p_drop: parsed.data.drop});
  if (error) redirect(`/admin/clients/fusion?keep=${parsed.data.keep}&drop=${parsed.data.drop}&erreur=echec`);
  revalidatePath('/admin/clients');
  revalidatePath('/admin/demandes');
  redirect(`/admin/clients/${parsed.data.keep}`);
}
