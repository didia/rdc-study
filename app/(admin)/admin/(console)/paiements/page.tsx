import Link from 'next/link';

import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {formatDate} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {CURRENCIES, formatCents, kindLabel, methodLabel, netByCurrency, PAYMENT_KINDS, PAYMENT_METHODS} from '@/lib/admin/money';
import {listPayments, PAYMENTS_PAGE_SIZE, parsePaymentFilters} from '@/lib/admin/queries/payments';
import {listStaff} from '@/lib/admin/queries/requests';
import {isAdmin} from '@/lib/admin/roles';

export default async function PaymentsPage({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const {supabase, profile} = await requireStaff('agent');
  const filters = parsePaymentFilters(await searchParams);
  const [{rows, total}, staff] = await Promise.all([listPayments(supabase, filters), listStaff(supabase, false)]);
  const pages = Math.max(1, Math.ceil(total / PAYMENTS_PAGE_SIZE));

  const query = (f: Partial<typeof filters>) => {
    const merged = {...filters, ...f};
    const qs = new URLSearchParams();
    for (const key of ['from', 'to', 'method', 'kind', 'agent'] as const) if (merged[key]) qs.set(key, merged[key]);
    if (merged.voided) qs.set('voided', '1');
    if (merged.page > 1) qs.set('page', String(merged.page));
    const text = qs.toString();
    return text ? `?${text}` : '';
  };

  // Totals of this page's non-voided rows, per currency (never mixed).
  const totals = netByCurrency(rows.map((r) => ({id: r.id, kind: r.kind, amount_cents: r.amount_cents, currency: r.currency, voided_at: r.voided_at})));
  void CURRENCIES;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.payments.list-title')}</h1>
        {isAdmin(profile.role) && (
          <a href={`/admin/paiements/export${query({page: 1})}`} className={styles.buttonSecondary}>{t('admin.requests.export')}</a>
        )}
      </div>

      <form method="get" className={styles.filters}>
        <div className={styles.field}>
          <label htmlFor="from">{t('admin.payments.paid-from')}</label>
          <input id="from" name="from" type="date" defaultValue={filters.from} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="to">{t('admin.requests.to')}</label>
          <input id="to" name="to" type="date" defaultValue={filters.to} className={styles.input} />
        </div>
        <Select id="method" label={t('admin.payments.method')} value={filters.method} options={PAYMENT_METHODS.map((m) => [m.code, m.label])} />
        <Select id="kind" label={t('admin.payments.kind')} value={filters.kind} options={PAYMENT_KINDS.map((k) => [k.code, k.label])} />
        <Select id="agent" label={t('admin.payments.recorded-by')} value={filters.agent} options={staff.map((s) => [s.id, s.full_name])} />
        <label className={styles.checkLine}>
          <input type="checkbox" name="voided" value="1" defaultChecked={filters.voided} /> {t('admin.payments.show-voided')}
        </label>
        <div className={styles.filtersActions}>
          <button type="submit" className={styles.button}>{t('admin.requests.filter')}</button>
          <Link href="/admin/paiements">{t('admin.requests.reset')}</Link>
        </div>
      </form>

      <p style={{marginBottom: 12}}>
        <strong>{t('admin.payments.total-page')}</strong>{' '}
        {Object.keys(totals).length ? Object.entries(totals).map(([c, n]) => formatCents(n, c)).join(' · ') : '—'}
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('admin.payments.date')}</th>
              <th>{t('admin.requests.reference')}</th>
              <th>{t('admin.requests.client')}</th>
              <th>{t('admin.payments.kind')}</th>
              <th>{t('admin.payments.amount')}</th>
              <th>{t('admin.payments.method')}</th>
              <th>{t('admin.payments.reference')}</th>
              <th>{t('admin.payments.recorded-by')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className={styles.muted}>{t('admin.payments.empty')}</td></tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className={p.voided_at ? styles.voided : undefined}>
                <td>{formatDate(p.paid_at)}</td>
                <td><Link href={`/admin/demandes/${p.request?.id}`}>{p.request?.reference}</Link></td>
                <td>{p.request?.client?.first_name} {p.request?.client?.last_name}</td>
                <td>{kindLabel(p.kind)}{p.voided_at && <div className={styles.stale}>{t('admin.payments.void-badge')}</div>}</td>
                <td>{p.kind === 'refund' ? '−' : ''}{formatCents(p.amount_cents, p.currency)}</td>
                <td>{methodLabel(p.method)}</td>
                <td>{p.external_ref ?? '—'}</td>
                <td>{p.recorder?.full_name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pager}>
        <span>{t('admin.payments.count', {count: total})}</span>
        <span className={styles.headerActions}>
          {filters.page > 1 && <Link href={`/admin/paiements${query({page: filters.page - 1})}`}>← {t('admin.requests.prev')}</Link>}
          <span>{t('admin.requests.page', {page: filters.page, pages})}</span>
          {filters.page < pages && <Link href={`/admin/paiements${query({page: filters.page + 1})}`}>{t('admin.requests.next')} →</Link>}
        </span>
      </div>
    </>
  );
}

function Select({id, label, value, options}: {id: string; label: string; value: string; options: (readonly [string, string])[] | string[][]}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={id} defaultValue={value} className={styles.select}>
        <option value="">{t('admin.requests.any')}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}
