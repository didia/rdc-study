import {AddExceptionForm, PriceForm} from '@/components/admin/PriceForms';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {listPackages, packageLabel} from '@/lib/admin/catalogue';
import {KIND_LABELS} from '@/lib/admin/catalogue-labels';
import {formatDateTime, formatMoney} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {PRICED_SERVICES, scopeLabel} from '@/lib/admin/price-scopes';
import {isAdmin} from '@/lib/admin/roles';

export default async function PricesPage() {
  const {supabase, profile} = await requireStaff();
  const admin = isAdmin(profile.role);

  const [{data: prices}, {data: history}, {data: staff}] = await Promise.all([
    supabase.from('service_prices').select('*').order('service_type').order('scope'),
    supabase.from('service_price_history').select('*').order('changed_at', {ascending: false}).limit(30),
    supabase.from('staff_profiles').select('id, full_name'),
  ]);
  const who = (id: string | null) => staff?.find((s) => s.id === id)?.full_name ?? t('admin.requests.system');
  const serviceLabel = (code: string) => PRICED_SERVICES.find((s) => s.code === code)?.label ?? code;

  const exceptionOptions = [
    ...Object.entries(KIND_LABELS).map(([kind, label]) => ({value: `kind:${kind}`, label: `${t('admin.prices.all-packages-of-type')} ${label}`})),
    ...listPackages().map((p) => ({value: `pkg:${p.slug}`, label: packageLabel(p.slug)})),
  ];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.prices.title')}</h1>
      </div>
      <p className={styles.muted} style={{marginBottom: 16}}>{admin ? t('admin.prices.lead') : t('admin.prices.read-only')}</p>

      {PRICED_SERVICES.map((service) => {
        const rows = (prices ?? []).filter((p) => p.service_type === service.code);
        return (
          <section key={service.code} className={styles.card}>
            <h2>{service.label}</h2>
            {rows.length === 0 && <p className={styles.muted}>{t('admin.prices.none')}</p>}
            {rows.map((row) => (
              <div key={row.scope} className={styles.priceBlock}>
                <div className={styles.priceHead}>
                  <strong>{scopeLabel(row.scope, packageLabel)}</strong> — {formatMoney(row.amount_cents, row.currency)}
                  <span className={styles.muted}>
                    {' '}· {t('admin.prices.last-change', {who: who(row.updated_by), when: formatDateTime(row.updated_at)})}
                  </span>
                </div>
                {admin && (
                  <PriceForm
                    serviceType={row.service_type}
                    scope={row.scope}
                    amountCents={row.amount_cents}
                    locked={'locked' in service && service.locked}
                    canRemove={row.scope.startsWith('pkg:') || (row.scope.startsWith('kind:') && service.allowExceptions && row.scope !== 'kind:visa')}
                  />
                )}
              </div>
            ))}
            {admin && service.allowExceptions && (
              <details className={styles.details} style={{marginTop: 14}}>
                <summary>{t('admin.prices.add-exception')}</summary>
                <AddExceptionForm options={exceptionOptions} />
              </details>
            )}
            {admin && !('locked' in service && service.locked) && <p className={styles.hint} style={{marginTop: 10}}>{t('admin.prices.confirm')}</p>}
          </section>
        );
      })}

      <section className={styles.card}>
        <h2>{t('admin.prices.history')}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.prices.when')}</th>
                <th>{t('admin.requests.service')}</th>
                <th>{t('admin.prices.scope')}</th>
                <th>{t('admin.prices.change')}</th>
                <th>{t('admin.prices.by')}</th>
                <th>{t('admin.prices.reason')}</th>
              </tr>
            </thead>
            <tbody>
              {(history ?? []).map((h) => (
                <tr key={h.id}>
                  <td>{formatDateTime(h.changed_at)}</td>
                  <td>{serviceLabel(h.service_type)}</td>
                  <td>{scopeLabel(h.scope, packageLabel)}</td>
                  <td>
                    {h.old_amount_cents == null ? '—' : formatMoney(h.old_amount_cents, h.currency)} →{' '}
                    {h.new_amount_cents == null ? t('admin.prices.removed-short') : formatMoney(h.new_amount_cents, h.currency)}
                  </td>
                  <td>{who(h.changed_by)}</td>
                  <td>{h.reason ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
