import Link from 'next/link';
import {notFound} from 'next/navigation';

import {ContactMenu} from '@/components/admin/ContactMenu';
import {DeliveryPanel} from '@/components/admin/DeliveryPanel';
import {DocumentsPanel} from '@/components/admin/DocumentsPanel';
import {ReceiptButton} from '@/components/admin/ReceiptButton';
import {AgreedPriceForm, RecordPaymentForm, SuggestionBanner, VoidPaymentForm} from '@/components/admin/PaymentForms';
import {AssignForm, DisputeToggle, EditDetailsForm, FollowUpForm, NoteForm, StatusChangeForm} from '@/components/admin/RequestForms';
import {StatusBadge} from '@/components/admin/StatusBadge';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {listPackages, packageLabel} from '@/lib/admin/catalogue';
import {formatDate, formatDateTime, formatMoney} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {getClientRequests, getRequest, getRequestEvents, getStatuses, listStaff} from '@/lib/admin/queries/requests';
import {RELANCE_LIMIT, relancesSinceLastStatusChange} from '@/lib/admin/followup';
import {getLostReasons, getTemplates} from '@/lib/admin/queries/today';
import {formatCents, effectivePrice, kindLabel, methodLabel, netByCurrency, paymentSuggestion} from '@/lib/admin/money';
import {checklistFor, type ChecklistState} from '@/lib/admin/checklist';
import {documentKindLabel} from '@/lib/admin/documents';
import {canEdit, hasRole, isAdmin} from '@/lib/admin/roles';
import {defaultPaymentInstructions, officeAddress} from '@/lib/admin/templates';
import {channelLabel, serviceLabel, sourceLabel, whatsappLink} from '@/lib/admin/vocab';

const uuidLike = /^[0-9a-f-]{36}$/i;

export default async function RequestDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  if (!uuidLike.test(id)) notFound();
  const {supabase, profile} = await requireStaff();
  const request = await getRequest(supabase, id);
  if (!request) notFound();

  const [statuses, staff, events, others, lostReasons, templates] = await Promise.all([
    getStatuses(supabase, true),
    listStaff(supabase),
    getRequestEvents(supabase, id),
    getClientRequests(supabase, request.client_id, id),
    getLostReasons(supabase),
    getTemplates(supabase),
  ]);
  const editable = canEdit(profile.role);
  const canSeeMoney = hasRole(profile.role, 'agent');
  const [{data: payments}, {data: depositSetting}] = canSeeMoney
    ? await Promise.all([
        supabase.from('payments').select('*').eq('request_id', id).order('paid_at', {ascending: false}).order('created_at', {ascending: false}),
        supabase.from('app_settings').select('value').eq('key', 'deposit_share').maybeSingle(),
      ])
    : [{data: null}, {data: null}];
  const isMentorEarly = profile.role === 'mentor';
  const {data: documentRows} = canSeeMoney || isMentorEarly
    ? await supabase.from('request_documents').select('*, uploader:staff_profiles(full_name)').eq('request_id', id).order('created_at', {ascending: false})
    : {data: null};
  const documents = (documentRows ?? []).map((d: any) => ({
    id: d.id,
    kind: d.kind,
    file_name: d.file_name,
    size_bytes: d.size_bytes,
    created_at: d.created_at,
    uploaded_by_name: d.uploader?.full_name ?? null,
    date: formatDate(d.created_at),
  }));
  const net = netByCurrency(payments ?? []);
  const price = effectivePrice(request);
  const suggestion = canSeeMoney
    ? paymentSuggestion({status: request.status, price, currency: request.agreed_currency, net, depositShare: Number(depositSetting?.value ?? 0.5)})
    : null;
  const activeStatuses = statuses.filter((s) => s.is_active || s.code === request.status);
  const staffName = (uid: string | null) => staff.find((s) => s.id === uid)?.full_name ?? t('admin.requests.unassigned');
  const statusLabel = (code: string | null) => statuses.find((s) => s.code === code)?.label_fr ?? code ?? '';
  const client = request.client;
  const wa = whatsappLink(client.phone_e164);
  const packages = listPackages().map((p) => ({slug: p.slug, label: packageLabel(p.slug)}));
  const priceMismatch =
    request.quoted_price_cents != null && request.displayed_price_cents != null && request.quoted_price_cents !== request.displayed_price_cents;
  const relances = relancesSinceLastStatusChange(events);
  const stage = statuses.find((x) => x.code === request.status)?.stage;
  const templateVars = {
    first_name: client.first_name,
    last_name: client.last_name,
    package: request.package_slug ? packageLabel(request.package_slug) : serviceLabel(request.service_type),
    reference: request.reference,
    staff_name: profile.full_name.split(' ')[0],
    payment_instructions: defaultPaymentInstructions(),
    office_address: officeAddress(),
  };
  const isMentor = profile.role === 'mentor';
  const showDelivery = ['deposit_paid', 'paid', 'in_progress', 'completed'].includes(request.status);
  const pkg = listPackages().find((p) => p.slug === request.package_slug);
  const checklistState = (request.delivery_checklist ?? {}) as ChecklistState;
  const checklistItems = checklistFor(request.package_slug, pkg?.services).map((i) => ({
    key: i.key,
    label: i.label,
    done: !!checklistState[i.key]?.done,
    meta: checklistState[i.key]?.at ? `${staffName(checklistState[i.key].by ?? null)} · ${formatDate(checklistState[i.key].at ?? null)}` : null,
  }));
  const mentors = staff.filter((m) => m.role === 'mentor' || m.role === 'agent' || m.role === 'admin');
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

      {stage === 'open' && relances >= RELANCE_LIMIT && (
        <p className={styles.warning} role="status" style={{marginBottom: 16}}>
          {t('admin.requests.relance-suggestion', {count: relances})}
        </p>
      )}

      {editable && suggestion && (
        <SuggestionBanner
          requestId={request.id}
          status={suggestion.status}
          label={statusLabel(suggestion.status)}
          amounts={`${formatCents(suggestion.paid, request.agreed_currency)} / ${formatCents(suggestion.threshold, request.agreed_currency)}`}
        />
      )}

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
              {request.mentor_id && (
                <>
                  <dt>{t('admin.delivery.mentor')}</dt>
                  <dd>{staffName(request.mentor_id)}</dd>
                </>
              )}
              <dt>{t('admin.requests.quoted-price')}</dt>
              <dd>{formatMoney(request.quoted_price_cents, request.quoted_currency ?? 'USD')}</dd>
              {request.lost_reason && (
                <>
                  <dt>{t('admin.requests.status.lost-reason')}</dt>
                  <dd>{lostReasons.find((r) => r.code === request.lost_reason)?.label_fr ?? request.lost_reason}</dd>
                </>
              )}
              {request.next_follow_up_at && (
                <>
                  <dt>{t('admin.requests.reminder')}</dt>
                  <dd>{formatDate(request.next_follow_up_at)}</dd>
                </>
              )}
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
              <StatusChangeForm id={request.id} current={request.status} updatedAt={request.updated_at} statuses={activeStatuses} lostReasons={lostReasons} />
              <hr style={{margin: '18px 0', border: 0, borderTop: '1px solid var(--line)'}} />
              <AssignForm id={request.id} current={request.assigned_to} updatedAt={request.updated_at} staff={staff} />
              {stage === 'open' && (
                <>
                  <hr style={{margin: '18px 0', border: 0, borderTop: '1px solid var(--line)'}} />
                  <FollowUpForm id={request.id} value={request.next_follow_up_at} />
                </>
              )}
            </section>
          )}
          {showDelivery && (editable || isMentor) && (
            <section className={styles.card}>
              <h2>{t('admin.delivery.title')}</h2>
              <DeliveryPanel
                requestId={request.id}
                items={checklistItems}
                status={request.status}
                canWork
                canAssign={editable}
                mentorId={request.mentor_id}
                mentors={mentors.map((m) => ({id: m.id, full_name: m.full_name}))}
              />
            </section>
          )}
          {editable && (
            <section className={styles.card}>
              <h2>{t('admin.contact.title')}</h2>
              <ContactMenu
                requestId={request.id}
                clientName={`${client.first_name} ${client.last_name}`}
                email={client.email}
                phone={client.phone}
                phoneE164={client.phone_e164}
                vars={templateVars}
                templates={templates}
              />
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

          {canSeeMoney && (
            <section className={styles.card}>
              <h2>{t('admin.payments.title')}</h2>
              <dl className={styles.facts}>
                <dt>{t('admin.payments.price')}</dt>
                <dd>
                  {price != null ? formatCents(price, request.agreed_currency) : '—'}
                  {request.agreed_price_cents != null && request.agreed_price_cents !== request.quoted_price_cents && (
                    <span className={styles.muted}> ({t('admin.payments.quoted', {price: formatCents(request.quoted_price_cents ?? 0, request.quoted_currency ?? 'USD')})})</span>
                  )}
                </dd>
                <dt>{t('admin.payments.paid')}</dt>
                <dd>{Object.keys(net).length ? Object.entries(net).map(([c, n]) => formatCents(n, c)).join(' · ') : formatCents(0, request.agreed_currency)}</dd>
                <dt>{t('admin.payments.balance')}</dt>
                <dd>{price != null ? formatCents(price - (net[request.agreed_currency] ?? 0), request.agreed_currency) : '—'}</dd>
              </dl>
              {editable && (
                <div style={{marginTop: 12}}>
                  <AgreedPriceForm requestId={request.id} quotedCents={request.quoted_price_cents} agreedCents={request.agreed_price_cents} currency={request.agreed_currency} />
                </div>
              )}
              {(payments ?? []).length > 0 && (
                <ul className={styles.paymentList}>
                  {(payments ?? []).map((p) => (
                    <li key={p.id} className={p.voided_at ? styles.voided : undefined}>
                      <div>
                        <strong>{p.kind === 'refund' ? '−' : ''}{formatCents(p.amount_cents, p.currency)}</strong> · {kindLabel(p.kind)} · {methodLabel(p.method)}
                        <div className={styles.muted}>
                          {formatDate(p.paid_at)}{p.external_ref ? ` · ${p.external_ref}` : ''}{p.note ? ` · ${p.note}` : ''}
                        </div>
                        {p.voided_at && <div className={styles.stale}>{t('admin.payments.voided-on', {date: formatDate(p.voided_at), reason: p.void_reason ?? ''})}</div>}
                      </div>
                      <div>
                        {editable && !p.voided_at && <ReceiptButton requestId={request.id} paymentId={p.id} />}
                        {isAdmin(profile.role) && !p.voided_at && <VoidPaymentForm requestId={request.id} paymentId={p.id} />}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {editable && (
                <details className={styles.details} style={{marginTop: 14}} open={(payments ?? []).length === 0 && stage !== 'lost'}>
                  <summary>{t('admin.payments.record')}</summary>
                  <RecordPaymentForm requestId={request.id} defaultCurrency={request.agreed_currency} />
                </details>
              )}
            </section>
          )}

          {(canSeeMoney || isMentor) && (
            <section className={styles.card}>
              <h2>{t('admin.documents.title')}</h2>
              <DocumentsPanel requestId={request.id} documents={documents} canGenerate={editable && price != null} kinds={isMentor ? ['deliverable', 'other'] : undefined} />
            </section>
          )}

          <section className={styles.card}>
            <h2>{t('admin.requests.timeline')}</h2>
            {(editable || isMentor) && <NoteForm id={request.id} hideChannel={isMentor} />}
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
      return e.metadata?.role === 'mentor'
        ? t('admin.requests.event.mentor', {name: staffName(e.metadata?.to ?? null)})
        : t('admin.requests.event.assignment', {name: staffName(e.metadata?.to ?? null)});
    case 'contact_attempt':
      return t('admin.requests.event.contact', {channel: channelLabel(e.channel)});
    case 'field_change':
      if (e.metadata?.field === 'agreed_price') {
        return t('admin.requests.event.agreed-price', {from: formatCents(e.metadata?.from ?? 0), to: formatCents(e.metadata?.to ?? 0)});
      }
      if (e.metadata?.field === 'client_id') return t('admin.requests.event.merged');
      if (e.metadata?.field === 'checklist') return t(e.metadata?.done ? 'admin.requests.event.checked' : 'admin.requests.event.unchecked');
      return e.metadata?.field === 'has_dispute'
        ? t('admin.requests.event.dispute')
        : t('admin.requests.event.field', {field: fieldLabel(e.metadata?.field), from: String(e.metadata?.from ?? '—'), to: String(e.metadata?.to ?? '—')});
    case 'document':
      return t('admin.requests.event.document', {kind: documentKindLabel(e.metadata?.kind ?? '')});
    case 'note':
      return t('admin.requests.event.note');
    case 'payment': {
      const amount = formatCents(e.metadata?.amount_cents ?? 0, e.metadata?.currency ?? 'USD');
      const values = {amount, kind: kindLabel(e.metadata?.kind ?? '')};
      return e.metadata?.action === 'voided' ? t('admin.requests.event.payment-voided', values) : t('admin.requests.event.payment', values);
    }
    default:
      return e.type;
  }
}

const fieldLabel = (field: string | undefined) =>
  ({service_type: t('admin.requests.service'), destination_country: t('admin.requests.destination'), package_slug: t('admin.requests.package')})[field ?? ''] ?? field ?? '';
