import {redirect} from 'next/navigation';

import {AuthCard} from '@/components/admin/AuthCard';
import {MfaChallengeForm} from '@/components/admin/MfaForms';
import {getStaffContext} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {safeAdminPath} from '@/lib/admin/safe-redirect';

export default async function MfaPage({searchParams}: {searchParams: Promise<{next?: string}>}) {
  const {next} = await searchParams;
  const ctx = await getStaffContext();
  if (ctx.status === 'ok') redirect(safeAdminPath(next));
  if (ctx.status !== 'mfa_required') redirect('/admin/login');

  return (
    <AuthCard title={t('admin.mfa.title')} lead={t('admin.mfa.lead')}>
      <MfaChallengeForm next={safeAdminPath(next)} />
    </AuthCard>
  );
}
