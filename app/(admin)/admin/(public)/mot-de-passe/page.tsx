import {redirect} from 'next/navigation';

import {AuthCard} from '@/components/admin/AuthCard';
import {SetPasswordForm} from '@/components/admin/AuthForms';
import {isAdminConfigured} from '@/lib/admin/env';
import {createSupabaseServerClient} from '@/lib/admin/db/server';
import {t} from '@/lib/admin/i18n';

// Reached from an invitation or password-reset email: the callback route has already signed the user in.
export default async function SetPasswordPage() {
  if (!isAdminConfigured()) redirect('/admin/login');
  const supabase = await createSupabaseServerClient();
  const {data} = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');

  return (
    <AuthCard title={t('admin.password.title')} lead={t('admin.password.lead')}>
      <SetPasswordForm />
    </AuthCard>
  );
}
