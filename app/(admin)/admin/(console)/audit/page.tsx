import Link from 'next/link';

import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {formatDateTime} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {AUDIT_PAGE_SIZE, listAuditEvents, listLogins, listRequestEvents, parseAuditFilters} from '@/lib/admin/queries/audit';
import {listStaff} from '@/lib/admin/queries/requests';

const EVENT_TYPES = ['created', 'status_change', 'note', 'contact_attempt', 'assignment', 'field_change', 'payment', 'document'];

export default async function AuditPage({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const {supabase} = await requireStaff('admin');
  const filters = parseAuditFilters(await searchParams);
  const [events, audit, logins, staff] = await Promise.all([
    listRequestEvents(supabase, filters),
    listAuditEvents(supabase, filters),
    listLogins(supabase, filters),
    listStaff(supabase, false),
  ]);
  const pages = Math.max(1, Math.ceil(events.total / AUDIT_PAGE_SIZE));
  const query = (page: number) => {
    const qs = new URLSearchParams();
    for (const key of ['actor', 'type', 'from', 'to'] as const) if (filters[key]) qs.set(key, filters[key]);
    if (page > 1) qs.set('page', String(page));
    const text = qs.toString();
    return text ? `?${text}` : '';
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.audit.title')}</h1>
        <a href={`/admin/audit/export${query(1)}`} className={styles.buttonSecondary}>{t('admin.requests.export')}</a>
      </div>

      <form method="get" className={styles.filters}>
        <div className={styles.field}>
          <label htmlFor="actor">{t('admin.audit.actor')}</label>
          <select id="actor" name="actor" defaultValue={filters.actor} className={styles.select}>
            <option value="">{t('admin.requests.any')}</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.full_name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="type">{t('admin.audit.type')}</label>
          <select id="type" name="type" defaultValue={filters.type} className={styles.select}>
            <option value="">{t('admin.requests.any')}</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="from">{t('admin.requests.from')}</label>
          <input id="from" name="from" type="date" defaultValue={filters.from} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="to">{t('admin.requests.to')}</label>
          <input id="to" name="to" type="date" defaultValue={filters.to} className={styles.input} />
        </div>
        <div className={styles.filtersActions}>
          <button type="submit" className={styles.button}>{t('admin.requests.filter')}</button>
          <Link href="/admin/audit">{t('admin.requests.reset')}</Link>
        </div>
      </form>

      <section className={styles.card}>
        <h2>{t('admin.audit.requests-history')}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.prices.when')}</th>
                <th>{t('admin.audit.actor')}</th>
                <th>{t('admin.audit.type')}</th>
                <th>{t('admin.requests.reference')}</th>
                <th>{t('admin.audit.detail')}</th>
              </tr>
            </thead>
            <tbody>
              {events.rows.length === 0 && <tr><td colSpan={5} className={styles.muted}>{t('admin.audit.empty')}</td></tr>}
              {events.rows.map((e) => (
                <tr key={e.id}>
                  <td>{formatDateTime(e.created_at)}</td>
                  <td>{e.actor?.full_name ?? t('admin.requests.system')}</td>
                  <td>{e.type}</td>
                  <td>{e.request ? <Link href={`/admin/demandes/${e.request.id}`}>{e.request.reference}</Link> : '—'}</td>
                  <td>{[e.from_status && e.to_status ? `${e.from_status} → ${e.to_status}` : null, e.body].filter(Boolean).join(' · ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pager}>
          <span>{t('admin.audit.count', {count: events.total})}</span>
          <span className={styles.headerActions}>
            {filters.page > 1 && <Link href={`/admin/audit${query(filters.page - 1)}`}>← {t('admin.requests.prev')}</Link>}
            <span>{t('admin.requests.page', {page: filters.page, pages})}</span>
            {filters.page < pages && <Link href={`/admin/audit${query(filters.page + 1)}`}>{t('admin.requests.next')} →</Link>}
          </span>
        </div>
      </section>

      <section className={styles.card}>
        <h2>{t('admin.audit.exports')}</h2>
        <ul className={styles.countList}>
          {audit.length === 0 && <li className={styles.muted}>{t('admin.audit.empty')}</li>}
          {audit.map((a) => (
            <li key={a.id}>
              <span>
                {formatDateTime(a.created_at)} · {a.actor?.full_name ?? '—'} · <strong>{a.type}</strong>
              </span>
              <span className={styles.muted}>{JSON.stringify(a.metadata)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h2>{t('admin.audit.logins')}</h2>
        <ul className={styles.countList}>
          {logins.length === 0 && <li className={styles.muted}>{t('admin.audit.empty')}</li>}
          {logins.map((l, i) => (
            <li key={i}>
              <span>{formatDateTime(l.at)} · {l.email ?? '—'}</span>
              <span className={styles.muted}>{l.action}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
