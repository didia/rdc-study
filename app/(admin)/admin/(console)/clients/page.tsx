import Link from 'next/link';

import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {formatDate} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {CLIENTS_PAGE_SIZE, listClients} from '@/lib/admin/queries/clients';

export default async function ClientsPage({searchParams}: {searchParams: Promise<{q?: string; page?: string}>}) {
  const {supabase} = await requireStaff();
  const {q = '', page: pageRaw} = await searchParams;
  const page = Math.max(1, Number.parseInt(pageRaw ?? '1', 10) || 1);
  const {rows, total} = await listClients(supabase, q.slice(0, 100), page);
  const pages = Math.max(1, Math.ceil(total / CLIENTS_PAGE_SIZE));
  const href = (p: number) => `/admin/clients?${new URLSearchParams({...(q ? {q} : {}), ...(p > 1 ? {page: String(p)} : {})}).toString()}`;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.clients.title')}</h1>
      </div>
      <form method="get" className={styles.filters}>
        <div className={styles.field}>
          <label htmlFor="q">{t('admin.requests.search')}</label>
          <input id="q" name="q" defaultValue={q} className={styles.input} placeholder={t('admin.clients.search-hint')} />
        </div>
        <div className={styles.filtersActions}>
          <button type="submit" className={styles.button}>{t('admin.requests.filter')}</button>
          <Link href="/admin/clients">{t('admin.requests.reset')}</Link>
        </div>
      </form>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('admin.clients.name')}</th>
              <th>{t('admin.auth.email')}</th>
              <th>{t('admin.clients.phone')}</th>
              <th>{t('admin.clients.origin')}</th>
              <th>{t('admin.clients.requests')}</th>
              <th>{t('admin.clients.created')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className={styles.muted}>{t('admin.clients.empty')}</td></tr>
            )}
            {rows.map((c) => (
              <tr key={c.id}>
                <td><Link href={`/admin/clients/${c.id}`}>{c.first_name} {c.last_name}</Link></td>
                <td>{c.email ?? '—'}</td>
                <td>{c.phone ?? '—'}</td>
                <td>{c.origin_country ?? '—'}</td>
                <td>{c.request_count}</td>
                <td>{formatDate(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pager}>
        <span>{t('admin.clients.count', {count: total})}</span>
        <span className={styles.headerActions}>
          {page > 1 && <Link href={href(page - 1)}>← {t('admin.requests.prev')}</Link>}
          <span>{t('admin.requests.page', {page, pages})}</span>
          {page < pages && <Link href={href(page + 1)}>{t('admin.requests.next')} →</Link>}
        </span>
      </div>
    </>
  );
}
