import Link from 'next/link';

import {StatusBadge} from '@/components/admin/StatusBadge';
import {TodayActions} from '@/components/admin/TodayActions';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {packageLabel} from '@/lib/admin/catalogue';
import {formatDate, timeAgo} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {getStatuses, type RequestListItem, type StatusRow} from '@/lib/admin/queries/requests';
import {getTodayData} from '@/lib/admin/queries/today';
import {canEdit} from '@/lib/admin/roles';
import {serviceLabel} from '@/lib/admin/vocab';

export default async function TodayPage() {
  const {supabase, user, profile} = await requireStaff();
  const statuses = await getStatuses(supabase);
  const data = await getTodayData(supabase, user.id, statuses);
  const editable = canEdit(profile.role);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.today.title', {name: profile.full_name.split(' ')[0]})}</h1>
        <Link href="/admin/demandes">{t('admin.today.all-requests')} →</Link>
      </div>

      <Section title={t('admin.today.overdue')} count={data.overdue.length} alert empty={t('admin.today.overdue-empty')}>
        {data.overdue.map((r) => (
          <Item key={r.id} request={r} statuses={statuses}>
            <p className={styles.muted}>{t('admin.today.due', {date: formatDate(r.next_follow_up_at)})}</p>
            {editable && <TodayActions id={r.id} />}
          </Item>
        ))}
      </Section>

      <Section title={t('admin.today.unassigned')} count={data.unassignedNew.length} empty={t('admin.today.unassigned-empty')}>
        {data.unassignedNew.map((r) => (
          <Item key={r.id} request={r} statuses={statuses}>
            <p className={styles.muted}>{t('admin.today.received', {when: timeAgo(r.submitted_at)})}</p>
          </Item>
        ))}
      </Section>

      <Section title={t('admin.today.waiting')} count={data.waiting.length} empty={t('admin.today.waiting-empty')}>
        {data.waiting.map((r) => (
          <Item key={r.id} request={r} statuses={statuses}>
            <p className={styles.muted}>{t('admin.today.last-activity', {when: timeAgo(r.last_activity_at)})}</p>
          </Item>
        ))}
      </Section>

      <Section title={t('admin.today.mine')} count={data.mine.length} empty={t('admin.today.mine-empty')}>
        {data.mine.map((r) => (
          <Item key={r.id} request={r} statuses={statuses}>
            <p className={styles.muted}>{t('admin.today.last-activity', {when: timeAgo(r.last_activity_at)})}</p>
          </Item>
        ))}
      </Section>
    </>
  );
}

function Section({title, count, alert, empty, children}: {title: string; count: number; alert?: boolean; empty: string; children: React.ReactNode}) {
  return (
    <section className={styles.card}>
      <h2>
        {title} <span className={alert && count > 0 ? styles.count : styles.countMuted}>{count}</span>
      </h2>
      {count === 0 ? <p className={styles.muted}>{empty}</p> : <ul className={styles.todayList}>{children}</ul>}
    </section>
  );
}

function Item({request, statuses, children}: {request: RequestListItem; statuses: StatusRow[]; children: React.ReactNode}) {
  return (
    <li className={styles.todayItem}>
      <div className={styles.todayHead}>
        <Link href={`/admin/demandes/${request.id}`}>
          <strong>{request.reference}</strong>
        </Link>
        <span>
          {request.client.first_name} {request.client.last_name}
        </span>
        <StatusBadge status={request.status} statuses={statuses} />
        <span className={styles.muted}>
          {serviceLabel(request.service_type)}
          {request.package_slug ? ` · ${packageLabel(request.package_slug)}` : ''}
        </span>
        {request.assignee && <span className={styles.badge}>{request.assignee.full_name}</span>}
      </div>
      {children}
    </li>
  );
}
