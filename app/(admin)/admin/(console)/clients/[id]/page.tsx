import Link from 'next/link';
import {notFound} from 'next/navigation';

import {StatusBadge} from '@/components/admin/StatusBadge';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {anonymiseClientAction} from '@/lib/admin/actions/privacy';
import {isAdmin} from '@/lib/admin/roles';
import {packageLabel} from '@/lib/admin/catalogue';
import {formatDate} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {getClient} from '@/lib/admin/queries/clients';
import {getClientRequests, getStatuses} from '@/lib/admin/queries/requests';
import {serviceLabel, whatsappLink} from '@/lib/admin/vocab';

export default async function ClientDetailPage({params, searchParams}: {params: Promise<{id: string}>; searchParams: Promise<{erreur?: string}>}) {
  const {id} = await params;
  const {erreur} = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const {supabase, profile} = await requireStaff();
  const client = await getClient(supabase, id);
  if (!client) notFound();
  const [requests, statuses] = await Promise.all([getClientRequests(supabase, id), getStatuses(supabase, true)]);
  const wa = whatsappLink(client.phone_e164);

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/clients">← {t('admin.clients.title')}</Link>
          <h1>{client.first_name} {client.last_name}</h1>
        </div>
      </div>
      <section className={styles.card}>
        <dl className={styles.facts}>
          <dt>{t('admin.auth.email')}</dt>
          <dd>{client.email ? <a href={`mailto:${client.email}`}>{client.email}</a> : '—'}</dd>
          <dt>{t('admin.clients.phone')}</dt>
          <dd>{client.phone ?? '—'} {wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>}</dd>
          <dt>{t('admin.clients.origin')}</dt>
          <dd>{client.origin_country ?? '—'}</dd>
          <dt>{t('admin.clients.created')}</dt>
          <dd>{formatDate(client.created_at)}</dd>
        </dl>
      </section>
      <section className={styles.card}>
        <h2>{t('admin.clients.requests')}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.requests.reference')}</th>
                <th>{t('admin.requests.service')}</th>
                <th>{t('admin.requests.destination')}</th>
                <th>{t('admin.requests.status.label')}</th>
                <th>{t('admin.requests.submitted')}</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td><Link href={`/admin/demandes/${r.id}`}>{r.reference}</Link></td>
                  <td>{serviceLabel(r.service_type)}{r.package_slug && <div className={styles.muted}>{packageLabel(r.package_slug)}</div>}</td>
                  <td>{r.destination_country ?? '—'}</td>
                  <td><StatusBadge status={r.status} statuses={statuses} /></td>
                  <td>{formatDate(r.submitted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {client.anonymised_at && <p className={styles.alertInfo}>{t('admin.privacy.anonymised-on', {date: formatDate(client.anonymised_at)})}</p>}
      {isAdmin(profile.role) && !client.anonymised_at && (
        <section className={styles.card}>
          <h2>{t('admin.privacy.subject-title')}</h2>
          <p className={styles.muted} style={{marginBottom: 12}}>{t('admin.privacy.subject-lead')}</p>
          <div className={styles.headerActions}>
            <a href={`/admin/clients/${client.id}/export`} className={styles.buttonSecondary}>{t('admin.privacy.export')}</a>
          </div>
          <form action={anonymiseClientAction} className={styles.form} style={{marginTop: 16}}>
            <input type="hidden" name="id" value={client.id} />
            {erreur === 'confirmation' && <p className={styles.alertError} role="alert">{t('admin.privacy.confirm-needed')}</p>}
            <label className={styles.checkLine}>
              <input type="checkbox" name="confirm" value="yes" required /> {t('admin.privacy.anonymise-confirm')}
            </label>
            <div>
              <button type="submit" className={styles.buttonSecondary}>{t('admin.privacy.anonymise')}</button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
