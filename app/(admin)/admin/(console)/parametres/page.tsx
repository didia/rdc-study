import {LostReasonForm} from '@/components/admin/SettingsForms';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {getLostReasons} from '@/lib/admin/queries/today';

export default async function SettingsPage() {
  const {supabase} = await requireStaff('admin');
  const reasons = await getLostReasons(supabase, true);
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.settings.title')}</h1>
      </div>
      <section className={styles.card}>
        <h2>{t('admin.settings.lost-reasons')}</h2>
        <p className={styles.muted} style={{marginBottom: 12}}>{t('admin.settings.lost-reasons-lead')}</p>
        {reasons.map((r) => (
          <LostReasonForm key={r.code} reason={r} />
        ))}
        <details className={styles.details} style={{marginTop: 12}}>
          <summary>{t('admin.settings.add-lost-reason')}</summary>
          <LostReasonForm />
        </details>
      </section>
    </>
  );
}
