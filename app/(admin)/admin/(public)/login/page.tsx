import {redirect} from 'next/navigation';

import {AuthCard} from '@/components/admin/AuthCard';
import {LoginForm} from '@/components/admin/AuthForms';
import {getStaffContext} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {safeAdminPath} from '@/lib/admin/safe-redirect';
import styles from '@/components/admin/admin.module.scss';

export default async function LoginPage({searchParams}: {searchParams: Promise<{next?: string; erreur?: string}>}) {
  const {next, erreur} = await searchParams;
  const ctx = await getStaffContext();
  const target = safeAdminPath(next);

  if (ctx.status === 'ok') redirect(target);
  if (ctx.status === 'mfa_required') redirect('/admin/mfa');
  if (ctx.status === 'mfa_setup_required') redirect('/admin/securite?obligatoire=1');
  if (ctx.status === 'forbidden') redirect('/admin/acces-refuse');

  return (
    <AuthCard title={t('admin.auth.title')} lead={t('admin.auth.lead')}>
      {ctx.status === 'unconfigured' ? (
        <p className={styles.alertError} role="alert">{t('admin.auth.not-configured')}</p>
      ) : (
        <>
          {erreur === 'lien' && <p className={styles.alertError} role="alert">{t('admin.auth.link-expired')}</p>}
          <LoginForm next={target} />
        </>
      )}
    </AuthCard>
  );
}
