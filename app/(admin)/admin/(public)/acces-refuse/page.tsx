import Link from 'next/link';

import {AuthCard} from '@/components/admin/AuthCard';
import {signOut} from '@/lib/admin/actions/auth';
import {t} from '@/lib/admin/i18n';
import styles from '@/components/admin/admin.module.scss';

export default async function ForbiddenPage({searchParams}: {searchParams: Promise<{raison?: string}>}) {
  const {raison} = await searchParams;
  return (
    <AuthCard
      title={t('admin.forbidden.title')}
      lead={raison === 'role' ? t('admin.forbidden.role') : t('admin.forbidden.lead')}
    >
      <form action={signOut} className={styles.form}>
        <button type="submit" className={styles.buttonSecondary}>
          {t('admin.nav.sign-out')}
        </button>
        {raison === 'role' && <Link href="/admin">{t('admin.forbidden.back')}</Link>}
      </form>
    </AuthCard>
  );
}
