import Link from 'next/link';

import {RetentionSettingsForm, RunRetentionForm} from '@/components/admin/PrivacyForms';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {formatDate, formatDateTime} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';

export default async function PrivacyPage() {
  const {supabase} = await requireStaff('admin');
  const {data: settings} = await supabase.from('app_settings').select('key, value').in('key', ['retention_months', 'retention_auto']);
  const months = Number(settings?.find((s) => s.key === 'retention_months')?.value ?? 24);
  const auto = settings?.find((s) => s.key === 'retention_auto')?.value === true;

  const {data: candidates} = await supabase.rpc('fn_retention_candidates', {p_months: months});
  const ids = (candidates ?? []).map((c) => c.client_id);
  const {data: requests} = ids.length
    ? await supabase.from('service_requests').select('client_id, reference').in('client_id', ids)
    : {data: []};
  const refsByClient = new Map<string, string[]>();
  for (const r of requests ?? []) refsByClient.set(r.client_id, [...(refsByClient.get(r.client_id) ?? []), r.reference]);

  const {data: history} = await supabase
    .from('audit_events')
    .select('*')
    .in('type', ['retention_run', 'retention_dry_run', 'anonymise_client', 'export_client'])
    .order('created_at', {ascending: false})
    .limit(15);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.privacy.title')}</h1>
      </div>

      <section className={styles.card}>
        <h2>{t('admin.privacy.retention')}</h2>
        <p className={styles.muted} style={{marginBottom: 12}}>{t('admin.privacy.lead')}</p>
        <RetentionSettingsForm months={months} auto={auto} />
      </section>

      <section className={styles.card}>
        <h2>{t('admin.privacy.dry-run', {months})}</h2>
        {ids.length === 0 ? (
          <p className={styles.muted}>{t('admin.privacy.none')}</p>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('admin.clients.title')}</th>
                    <th>{t('admin.clients.requests')}</th>
                    <th>{t('admin.privacy.closed')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(candidates ?? []).map((c) => (
                    <tr key={c.client_id}>
                      <td><Link href={`/admin/clients/${c.client_id}`}>{(refsByClient.get(c.client_id) ?? []).join(', ')}</Link></td>
                      <td>{c.requests}</td>
                      <td>{formatDate(c.last_closed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{marginTop: 16}}>
              <RunRetentionForm months={months} disabled={false} />
            </div>
          </>
        )}
      </section>

      <section className={styles.card}>
        <h2>{t('admin.privacy.history')}</h2>
        <ul className={styles.countList}>
          {(history ?? []).length === 0 && <li className={styles.muted}>{t('admin.audit.empty')}</li>}
          {(history ?? []).map((h) => (
            <li key={h.id}>
              <span>{formatDateTime(h.created_at)} · <strong>{h.type}</strong></span>
              <span className={styles.muted}>{JSON.stringify(h.metadata)}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
