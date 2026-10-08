import {MfaEnroll} from '@/components/admin/MfaForms';
import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import styles from '@/components/admin/admin.module.scss';

export default async function SecurityPage({searchParams}: {searchParams: Promise<{obligatoire?: string}>}) {
  const {obligatoire} = await searchParams;
  const {supabase} = await requireStaff('viewer', {allowMfaSetup: true});
  const {data} = await supabase.auth.mfa.listFactors();
  const enrolled = (data?.totp ?? []).length > 0;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.security.title')}</h1>
      </div>
      {obligatoire && !enrolled && <p className={styles.alertInfo} role="status" style={{marginBottom: 16}}>{t('admin.security.mfa.required')}</p>}
      <section className={styles.card}>
        <h2>{t('admin.security.mfa.title')}</h2>
        {enrolled ? (
          <p className={styles.alertSuccess}>{t('admin.security.mfa.enabled')}</p>
        ) : (
          <>
            <p className={styles.muted} style={{marginBottom: 14}}>{t('admin.security.mfa.text')}</p>
            <MfaEnroll />
          </>
        )}
      </section>
    </>
  );
}
