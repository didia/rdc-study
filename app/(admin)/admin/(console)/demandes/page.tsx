import Link from 'next/link';

import {bulkUpdate} from '@/lib/admin/actions/requests';
import {SelectAll} from '@/components/admin/SelectAll';
import {StatusBadge} from '@/components/admin/StatusBadge';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {formatDate, timeAgo} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {isStale, PAGE_SIZE, parseListParams, toQueryString} from '@/lib/admin/list-params';
import {getStatuses, listRequests, listStaff, statusCounts} from '@/lib/admin/queries/requests';
import {canEdit} from '@/lib/admin/roles';
import {DESTINATION_COUNTRIES, ORIGIN_COUNTRIES, SERVICE_TYPES, SOURCES, serviceLabel, sourceLabel} from '@/lib/admin/vocab';
import {packageLabel} from '@/lib/admin/catalogue';

export default async function RequestsPage({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const {supabase, user, profile} = await requireStaff();
  const params = parseListParams(await searchParams);
  const editable = canEdit(profile.role);

  const [statuses, staff, list, counts] = await Promise.all([
    getStatuses(supabase),
    listStaff(supabase),
    listRequests(supabase, params, user.id),
    statusCounts(supabase, params, user.id),
  ]);
  const stageOf = (code: string) => statuses.find((s) => s.code === code)?.stage ?? 'open';
  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);
  const pages = Math.max(1, Math.ceil(list.total / PAGE_SIZE));
  const currentUrl = `/admin/demandes${toQueryString(params)}`;

  const pillHref = (code: string | null) => {
    const status = code === null ? [] : params.status.includes(code) ? params.status.filter((s) => s !== code) : [...params.status, code];
    return `/admin/demandes${toQueryString({...params, status, page: 1})}`;
  };
  const sortHref = (key: string) =>
    `/admin/demandes${toQueryString({...params, sort: key as any, dir: params.sort === key && params.dir === 'desc' ? 'asc' : 'desc', page: 1})}`;
  const pageHref = (page: number) => `/admin/demandes${toQueryString({...params, page})}`;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.requests.title')}</h1>
        {editable && (
          <Link href="/admin/demandes/nouvelle" className={styles.button}>
            {t('admin.requests.new.title')}
          </Link>
        )}
      </div>

      <nav className={styles.pills} aria-label={t('admin.requests.pills')}>
        <Link href={pillHref(null)} className={params.status.length === 0 ? styles.pillActive : styles.pill}>
          {t('admin.requests.all')} <small>{totalAll}</small>
        </Link>
        {statuses.map((s) => (
          <Link key={s.code} href={pillHref(s.code)} className={params.status.includes(s.code) ? styles.pillActive : styles.pill}>
            {s.label_fr} <small>{counts[s.code] ?? 0}</small>
          </Link>
        ))}
      </nav>

      <form method="get" className={styles.filters}>
        {params.status.length > 0 && <input type="hidden" name="status" value={params.status.join(',')} />}
        <div className={styles.field}>
          <label htmlFor="q">{t('admin.requests.search')}</label>
          <input id="q" name="q" defaultValue={params.q} className={styles.input} placeholder={t('admin.requests.search-hint')} />
        </div>
        <Filter id="service" label={t('admin.requests.service')} value={params.service} options={SERVICE_TYPES.map((s) => [s.code, s.label])} />
        <Filter id="destination" label={t('admin.requests.destination')} value={params.destination} options={DESTINATION_COUNTRIES.map((c) => [c, c])} />
        <Filter id="origin" label={t('admin.clients.origin')} value={params.origin} options={ORIGIN_COUNTRIES.map((c) => [c, c])} />
        <Filter
          id="assignee"
          label={t('admin.requests.assignee')}
          value={params.assignee}
          options={[['me', t('admin.requests.mine')], ['none', t('admin.requests.unassigned')], ...staff.map((s) => [s.id, s.full_name] as [string, string])]}
        />
        <Filter id="source" label={t('admin.requests.source')} value={params.source} options={SOURCES.map((s) => [s.code, s.label])} />
        <div className={styles.field}>
          <label htmlFor="from">{t('admin.requests.from')}</label>
          <input id="from" name="from" type="date" defaultValue={params.from} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="to">{t('admin.requests.to')}</label>
          <input id="to" name="to" type="date" defaultValue={params.to} className={styles.input} />
        </div>
        <div className={styles.filtersActions}>
          <button type="submit" className={styles.button}>{t('admin.requests.filter')}</button>
          <Link href="/admin/demandes">{t('admin.requests.reset')}</Link>
        </div>
      </form>

      <form action={bulkUpdate}>
        <input type="hidden" name="back" value={currentUrl} />
        {editable && (
          <div className={styles.bulkBar}>
            <strong>{t('admin.requests.bulk')}</strong>
            <select name="assignee" className={styles.select} aria-label={t('admin.requests.assignee')} defaultValue="">
              <option value="">{t('admin.requests.unassigned')}</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
            <button type="submit" name="bulk" value="assign" className={styles.buttonSecondary}>{t('admin.requests.assign')}</button>
            <select name="status" className={styles.select} aria-label={t('admin.requests.status.label')} defaultValue="contacted">
              {statuses.map((s) => (
                <option key={s.code} value={s.code}>{s.label_fr}</option>
              ))}
            </select>
            <input name="reason" className={styles.input} placeholder={t('admin.requests.status.reason')} />
            <button type="submit" name="bulk" value="status" className={styles.buttonSecondary}>{t('admin.requests.status.submit')}</button>
          </div>
        )}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {editable && <th><SelectAll /></th>}
                <th><Link href={sortHref('reference')}>{t('admin.requests.reference')}</Link></th>
                <th>{t('admin.requests.client')}</th>
                <th>{t('admin.requests.service')}</th>
                <th>{t('admin.requests.destination')}</th>
                <th><Link href={sortHref('status')}>{t('admin.requests.status.label')}</Link></th>
                <th>{t('admin.requests.assignee')}</th>
                <th><Link href={sortHref('submitted_at')}>{t('admin.requests.submitted')}</Link></th>
                <th><Link href={sortHref('last_activity_at')}>{t('admin.requests.last-activity')}</Link></th>
              </tr>
            </thead>
            <tbody>
              {list.rows.length === 0 && (
                <tr>
                  <td colSpan={9} className={styles.muted}>{t('admin.requests.empty')}</td>
                </tr>
              )}
              {list.rows.map((r) => (
                <tr key={r.id}>
                  {editable && <td><input type="checkbox" name="ids" value={r.id} aria-label={r.reference} /></td>}
                  <td><Link href={`/admin/demandes/${r.id}`}>{r.reference}</Link></td>
                  <td>
                    {r.client.first_name} {r.client.last_name}
                    {r.client.origin_country && <div className={styles.muted}>{r.client.origin_country}</div>}
                  </td>
                  <td>
                    {serviceLabel(r.service_type)}
                    {r.package_slug && <div className={styles.muted}>{packageLabel(r.package_slug)}</div>}
                  </td>
                  <td>{r.destination_country ?? '—'}</td>
                  <td>
                    <StatusBadge status={r.status} statuses={statuses} />
                    {r.has_dispute && <div className={styles.stale}>{t('admin.requests.dispute.badge')}</div>}
                  </td>
                  <td>{r.assignee?.full_name ?? <span className={styles.muted}>{t('admin.requests.unassigned')}</span>}</td>
                  <td title={sourceLabel(r.source)}>{formatDate(r.submitted_at)}</td>
                  <td>
                    {timeAgo(r.last_activity_at)}
                    {isStale(r.last_activity_at, stageOf(r.status)) && <div className={styles.stale}>{t('admin.requests.stale')}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>

      <div className={styles.pager}>
        <span>{t('admin.requests.count', {count: list.total})}</span>
        <span className={styles.headerActions}>
          {params.page > 1 && <Link href={pageHref(params.page - 1)}>← {t('admin.requests.prev')}</Link>}
          <span>{t('admin.requests.page', {page: params.page, pages})}</span>
          {params.page < pages && <Link href={pageHref(params.page + 1)}>{t('admin.requests.next')} →</Link>}
        </span>
      </div>
    </>
  );
}

function Filter({id, label, value, options}: {id: string; label: string; value: string; options: [string, string][]}) {
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
