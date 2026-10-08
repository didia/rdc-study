import {DepositShareForm, EnforceMfaForm, LostReasonForm, RoundRobinForm} from '@/components/admin/SettingsForms';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {getLostReasons} from '@/lib/admin/queries/today';
import {listStaff} from '@/lib/admin/queries/requests';
import {mfaEnrolment} from '@/lib/admin/staff-mfa';

export default async function SettingsPage() {
  const {supabase} = await requireStaff('admin');
  const reasons = await getLostReasons(supabase, true);
  const {data: settings} = await supabase.from('app_settings').select('key, value');
  const setting = settings?.find((s) => s.key === 'round_robin_enabled');
  const staff = await listStaff(supabase);
  const mfa = await mfaEnrolment(staff.map((m) => m.id));
  const mfaMissing = staff.filter((m) => (m.role === 'admin' || m.role === 'agent') && mfa[m.id] === false).map((m) => m.full_name);
  const mfaEnforced = settings?.find((s) => s.key === 'enforce_mfa')?.value === true;
  const depositShare = Number(settings?.find((s) => s.key === 'deposit_share')?.value ?? 0.5);
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.settings.title')}</h1>
      </div>
      <section className={styles.card}>
        <h2>{t('admin.settings.security')}</h2>
        <EnforceMfaForm enabled={mfaEnforced} missing={mfaMissing} />
      </section>
      <section className={styles.card}>
        <h2>{t('admin.settings.workload')}</h2>
        <RoundRobinForm enabled={setting?.value === true} />
      </section>
      <section className={styles.card}>
        <h2>{t('admin.settings.payments')}</h2>
        <DepositShareForm share={depositShare} />
      </section>
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
