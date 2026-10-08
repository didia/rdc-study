'use client';

import {useActionState, useState} from 'react';

import {addNote, assignRequest, changeStatus, toggleDispute, updateRequestDetails} from '@/lib/admin/actions/requests';
import {setFollowUpDate} from '@/lib/admin/actions/followup';
import {t} from '@/lib/admin/i18n';
import {CHANNELS, DESTINATION_COUNTRIES, ORIGIN_COUNTRIES, SERVICE_TYPES} from '@/lib/admin/vocab';
import type {StatusRow} from '@/lib/admin/queries/requests';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

const FOLLOW_UP_CHOICES = [1, 2, 3, 5, 7, 14];

export function StatusChangeForm({
  id,
  current,
  updatedAt,
  statuses,
  lostReasons,
}: {
  id: string;
  current: string;
  updatedAt: string;
  statuses: StatusRow[];
  lostReasons: {code: string; label_fr: string}[];
}) {
  const [state, action, pending] = useActionState(changeStatus, undefined);
  const [target, setTarget] = useState(current);
  const stage = statuses.find((s) => s.code === target)?.stage;
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="updatedAt" value={updatedAt} />
      <div className={styles.field}>
        <label htmlFor="status">{t('admin.requests.status.label')}</label>
        <select key={current} id="status" name="status" defaultValue={current} onChange={(e) => setTarget(e.target.value)} className={styles.select}>
          {statuses.map((s) => (
            <option key={s.code} value={s.code}>{s.label_fr}</option>
          ))}
        </select>
      </div>
      {stage === 'lost' && (
        <div className={styles.field}>
          <label htmlFor="lostReason">{t('admin.requests.status.lost-reason')}</label>
          <select id="lostReason" name="lostReason" required defaultValue="" className={styles.select}>
            <option value="" disabled>—</option>
            {lostReasons.map((r) => (
              <option key={r.code} value={r.code}>{r.label_fr}</option>
            ))}
          </select>
        </div>
      )}
      {stage === 'open' && (
        <div className={styles.field}>
          <label htmlFor="followUp">{t('admin.requests.status.follow-up')}</label>
          <select id="followUp" name="followUp" defaultValue="auto" className={styles.select}>
            <option value="auto">{t('admin.requests.status.follow-up-auto')}</option>
            <option value="none">{t('admin.requests.status.follow-up-none')}</option>
            {FOLLOW_UP_CHOICES.map((d) => (
              <option key={d} value={d}>{t('admin.requests.status.follow-up-days', {days: d})}</option>
            ))}
          </select>
        </div>
      )}
      <div className={styles.field}>
        <label htmlFor="reason">{t('admin.requests.status.reason')}</label>
        <input id="reason" name="reason" className={styles.input} placeholder={t('admin.requests.status.reason-hint')} defaultValue={state?.values?.reason ?? ''} />
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.status.submit')}</button>
      </div>
    </form>
  );
}

export function FollowUpForm({id, value}: {id: string; value: string | null}) {
  const [state, action, pending] = useActionState(setFollowUpDate, undefined);
  const date = value ? value.slice(0, 10) : '';
  return (
    <form action={action} className={styles.form} key={date}>
      <input type="hidden" name="id" value={id} />
      <div className={styles.field}>
        <label htmlFor="followUpDate">{t('admin.requests.reminder')}</label>
        <input id="followUpDate" type="date" name="date" defaultValue={date} className={styles.input} />
        <span className={styles.hint}>{t('admin.requests.reminder-hint')}</span>
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.buttonSecondary} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}

export function AssignForm({id, current, updatedAt, staff}: {id: string; current: string | null; updatedAt: string; staff: {id: string; full_name: string}[]}) {
  const [state, action, pending] = useActionState(assignRequest, undefined);
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="updatedAt" value={updatedAt} />
      <div className={styles.field}>
        <label htmlFor="assignee">{t('admin.requests.assignee')}</label>
        <select key={current ?? 'none'} id="assignee" name="assignee" defaultValue={current ?? ''} className={styles.select}>
          <option value="">{t('admin.requests.unassigned')}</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>{s.full_name}</option>
          ))}
        </select>
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.buttonSecondary} disabled={pending}>{t('admin.requests.assign')}</button>
      </div>
    </form>
  );
}

export function NoteForm({id}: {id: string}) {
  const [state, action, pending] = useActionState(addNote, undefined);
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="id" value={id} />
      <div className={styles.field}>
        <label htmlFor="body">{t('admin.requests.note.label')}</label>
        <textarea id="body" name="body" required maxLength={4000} defaultValue={state?.values?.body ?? ''} className={styles.textarea} />
      </div>
      <div className={styles.field}>
        <label htmlFor="channel">{t('admin.requests.note.channel')}</label>
        <select id="channel" name="channel" defaultValue="" className={styles.select}>
          <option value="">{t('admin.requests.note.plain')}</option>
          {CHANNELS.map((c) => (
            <option key={c.code} value={c.code}>{t('admin.requests.note.contact-via', {channel: c.label})}</option>
          ))}
        </select>
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.note.submit')}</button>
      </div>
    </form>
  );
}

export function DisputeToggle({id, hasDispute}: {id: string; hasDispute: boolean}) {
  const [, action, pending] = useActionState(toggleDispute, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="hasDispute" value={String(!hasDispute)} />
      <button type="submit" className={styles.linkButton} disabled={pending}>
        {hasDispute ? t('admin.requests.dispute.clear') : t('admin.requests.dispute.mark')}
      </button>
    </form>
  );
}

type EditProps = {
  request: {id: string; updated_at: string; service_type: string; destination_country: string | null; package_slug: string | null; status_reason: string | null};
  client: {id: string; first_name: string; last_name: string; email: string | null; phone: string | null; origin_country: string | null};
  packages: {slug: string; label: string}[];
};

export function EditDetailsForm({request, client, packages}: EditProps) {
  const [state, action, pending] = useActionState(updateRequestDetails, undefined);
  const v = (name: string, fallback: string | null) => state?.values?.[name] ?? fallback ?? '';
  return (
    <form key={state?.values ? JSON.stringify(state.values) : 'edit'} action={action} className={styles.form}>
      <input type="hidden" name="id" value={request.id} />
      <input type="hidden" name="clientId" value={client.id} />
      <input type="hidden" name="updatedAt" value={request.updated_at} />
      <div className={styles.inlineForm}>
        <div className={styles.field}>
          <label htmlFor="firstName">{t('admin.clients.first-name')}</label>
          <input id="firstName" name="firstName" defaultValue={v('firstName', client.first_name)} required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">{t('admin.clients.last-name')}</label>
          <input id="lastName" name="lastName" defaultValue={v('lastName', client.last_name)} required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">{t('admin.auth.email')}</label>
          <input id="email" name="email" type="email" defaultValue={v('email', client.email)} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">{t('admin.clients.phone')}</label>
          <input id="phone" name="phone" defaultValue={v('phone', client.phone)} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="originCountry">{t('admin.clients.origin')}</label>
          <select id="originCountry" name="originCountry" defaultValue={v('originCountry', client.origin_country)} className={styles.select}>
            <option value="">—</option>
            {withCurrent(ORIGIN_COUNTRIES, client.origin_country).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="serviceType">{t('admin.requests.service')}</label>
          <select id="serviceType" name="serviceType" defaultValue={v('serviceType', request.service_type)} className={styles.select}>
            {SERVICE_TYPES.map((s) => (
              <option key={s.code} value={s.code}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="destination">{t('admin.requests.destination')}</label>
          <select id="destination" name="destination" defaultValue={v('destination', request.destination_country)} className={styles.select}>
            <option value="">—</option>
            {withCurrent(DESTINATION_COUNTRIES, request.destination_country).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="packageSlug">{t('admin.requests.package')}</label>
          <select id="packageSlug" name="packageSlug" defaultValue={v('packageSlug', request.package_slug)} className={styles.select}>
            <option value="">—</option>
            {withCurrentPackage(packages, request.package_slug).map((p) => (
              <option key={p.slug} value={p.slug}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="statusReason">{t('admin.requests.status-reason')}</label>
        <input id="statusReason" name="statusReason" defaultValue={v('statusReason', request.status_reason)} className={styles.input} />
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}

const withCurrent = (list: string[], current: string | null) => (current && !list.includes(current) ? [current, ...list] : list);
const withCurrentPackage = (list: {slug: string; label: string}[], current: string | null) =>
  current && !list.some((p) => p.slug === current) ? [{slug: current, label: current}, ...list] : list;
