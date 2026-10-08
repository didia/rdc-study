import Link from 'next/link';
import {notFound} from 'next/navigation';

import {AssignForm, DisputeToggle, EditDetailsForm, NoteForm, StatusChangeForm} from '@/components/admin/RequestForms';
import {StatusBadge} from '@/components/admin/StatusBadge';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {listPackages, packageLabel} from '@/lib/admin/catalogue';
import {formatDate, formatDateTime, formatMoney} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {getClientRequests, getRequest, getRequestEvents, getStatuses, listStaff} from '@/lib/admin/queries/requests';
import {canEdit} from '@/lib/admin/roles';
import {channelLabel, serviceLabel, sourceLabel, whatsappLink} from '@/lib/admin/vocab';

const uuidLike = /^[0-9a-f-]{36}$/i;

export default async function RequestDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  if (!uuidLike.test(id)) notFound();
  const {supabase, profile} = await requireStaff();
  const request = await getRequest(supabase, id);
  if (!request) notFound();

  const [statuses, staff, events, others] = await Promise.all([
    getStatuses(supabase, true),
    listStaff(supabase),
    getRequestEvents(supabase, id),
    getClientRequests(supabase, request.client_id, id),
  ]);
  const editable = canEdit(profile.role);
  const activeStatuses = statuses.filter((s) => s.is_active || s.code === request.status);
  const staffName = (uid: string | null) => staff.find((s) => s.id === uid)?.full_name ?? t('admin.requests.unassigned');
  const statusLabel = (code: string | null) => statuses.find((s) => s.code === code)?.label_fr ?? code ?? '';
  const client = request.client;
  const wa = whatsappLink(client.phone_e164);
  const packages = listPackages().map((p) => ({slug: p.slug, label: packageLabel(p.slug)}));
  const priceMismatch =
    request.quoted_price_cents != null && request.displayed_price_cents != null && request.quoted_price_cents !== request.displayed_price_cents;
  const answers = Object.entries((request.form_answers ?? {}) as Record<string, unknown>);

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/demandes">← {t('admin.requests.title')}</Link>
          <h1>{request.reference}</h1>
        </div>
        <div className={styles.headerActions}>
          <StatusBadge status={request.status} statuses={statuses} />
          {request.has_dispute && <span className={styles.badgeOff}>{t('admin.requests.dispute.badge')}</span>}
          {editable && <DisputeToggle id={request.id} hasDispute={request.has_dispute} />}
        </div>
      </div>

      {priceMismatch && (
        <p className={styles.warning} role="status" style={{marginBottom: 16}}>
          {t('admin.requests.price-mismatch', {displayed: formatMoney(request.displayed_price_cents), quoted: formatMoney(request.quoted_price_cents)})}
        </p>
      )}

      <div className={styles.detailGrid}>
        <div>
          <section className={styles.card}>
            <h2>{t('admin.requests.client')}</h2>
            <dl className={styles.facts}>
              <dt>{t('admin.clients.name')}</dt>
              <dd><Link href={`/admin/clients/${client.id}`}>{client.first_name} {client.last_name}</Link></dd>
              <dt>{t('admin.auth.email')}</dt>
              <dd>{client.email ? <a href={`mailto:${client.email}`}>{client.email}</a> : '—'}</dd>
              <dt>{t('admin.clients.phone')}</dt>
              <dd>
                {client.phone ?? '—'} {wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>}
                {client.phone && !client.phone_e164 && <div className={styles.hint}>{t('admin.clients.phone-not-international')}</div>}
              </dd>
              <dt>{t('admin.clients.origin')}</dt>
              <dd>{client.origin_country ?? '—'}</dd>
            </dl>
            {others.length > 0 && (
              <>
                <h2 style={{marginTop: 18}}>{t('admin.requests.other-requests')}</h2>
                <ul>
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link href={`/admin/demandes/${o.id}`}>{o.reference}</Link> · {serviceLabel(o.service_type)} · {statusLabel(o.status)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className={styles.card}>
            <h2>{t('admin.requests.facts')}</h2>
            <dl className={styles.facts}>
              <dt>{t('admin.requests.service')}</dt>
              <dd>{serviceLabel(request.service_type)}</dd>
              <dt>{t('admin.requests.destination')}</dt>
              <dd>{request.destination_country ?? '—'}</dd>
              <dt>{t('admin.requests.package')}</dt>
              <dd>{request.package_slug ? packageLabel(request.package_slug) : '—'}</dd>
              <dt>{t('admin.requests.source')}</dt>
              <dd>
                {sourceLabel(request.source)}
                {request.source_url && <> · <span className={styles.muted}>{request.source_url}</span></>}
              </dd>
              <dt>{t('admin.requests.submitted')}</dt>
              <dd>{formatDateTime(request.submitted_at)}</dd>
              <dt>{t('admin.requests.quoted-price')}</dt>
              <dd>{formatMoney(request.quoted_price_cents, request.quoted_currency ?? 'USD')}</dd>
              <dt>{t('admin.requests.status-reason')}</dt>
              <dd>{request.status_reason ?? '—'}</dd>
            </dl>
            {request.original_message && (
              <>
                <h2 style={{marginTop: 18}}>{t('admin.requests.original-message')}</h2>
                <p className={styles.message}>{request.original_message}</p>
              </>
            )}
            {answers.length > 0 && (
              <>
                <h2 style={{marginTop: 18}}>{t('admin.requests.answers')}</h2>
                <dl className={styles.facts}>
                  {answers.map(([key, value]) => (
                    <FactRow key={key} label={key} value={value} />
                  ))}
                </dl>
              </>
            )}
          </section>

          {editable && (
            <section className={styles.card}>
              <details className={styles.details}>
                <summary>{t('admin.requests.edit')}</summary>
                <EditDetailsForm
                  request={request}
                  client={client}
                  packages={packages}
                />
              </details>
            </section>
          )}
        </div>

        <div>
          {editable && (
            <section className={styles.card}>
              <h2>{t('admin.requests.status.change')}</h2>
              <StatusChangeForm id={request.id} current={request.status} updatedAt={request.updated_at} statuses={activeStatuses} />
              <hr style={{margin: '18px 0', border: 0, borderTop: '1px solid var(--line)'}} />
              <AssignForm id={request.id} current={request.assigned_to} updatedAt={request.updated_at} staff={staff} />
            </section>
          )}
          {!editable && (
            <section className={styles.card}>
              <dl className={styles.facts}>
                <dt>{t('admin.requests.assignee')}</dt>
                <dd>{staffName(request.assigned_to)}</dd>
              </dl>
            </section>
          )}

          <section className={styles.card}>
            <h2>{t('admin.requests.timeline')}</h2>
            {editable && <NoteForm id={request.id} />}
            <ol className={styles.timeline}>
              {events.map((e) => (
                <li key={e.id} className={styles.timelineItem}>
                  <strong>{eventTitle(e, statusLabel, staffName)}</strong>
                  <div className={styles.timelineMeta}>
                    {formatDateTime(e.created_at)} · {e.actor?.full_name ?? t('admin.requests.system')}
                  </div>
                  {e.body && <p style={{whiteSpace: 'pre-wrap'}}>{e.body}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <p className={styles.muted} style={{marginTop: 12}}>{t('admin.requests.created-on', {date: formatDate(request.created_at)})}</p>
    </>
  );
}

function FactRow({label, value}: {label: string; value: unknown}) {
  const text = typeof value === 'boolean' ? (value ? t('admin.requests.yes') : t('admin.requests.no')) : String(value ?? '—');
  return (
    <>
      <dt>{label}</dt>
      <dd>{text}</dd>
    </>
  );
}

function eventTitle(
  e: {type: string; from_status: string | null; to_status: string | null; channel: string | null; metadata: any},
  statusLabel: (code: string | null) => string,
  staffName: (uid: string | null) => string,
): string {
  switch (e.type) {
    case 'created':
      return t('admin.requests.event.created');
    case 'status_change':
      return t('admin.requests.event.status', {from: statusLabel(e.from_status), to: statusLabel(e.to_status)});
    case 'assignment':
      return t('admin.requests.event.assignment', {name: staffName(e.metadata?.to ?? null)});
    case 'contact_attempt':
      return t('admin.requests.event.contact', {channel: channelLabel(e.channel)});
    case 'field_change':
      return e.metadata?.field === 'has_dispute'
        ? t('admin.requests.event.dispute')
        : t('admin.requests.event.field', {field: fieldLabel(e.metadata?.field), from: String(e.metadata?.from ?? '—'), to: String(e.metadata?.to ?? '—')});
    case 'note':
      return t('admin.requests.event.note');
    default:
      return e.type;
  }
}

const fieldLabel = (field: string | undefined) =>
  ({service_type: t('admin.requests.service'), destination_country: t('admin.requests.destination'), package_slug: t('admin.requests.package')})[field ?? ''] ?? field ?? '';
