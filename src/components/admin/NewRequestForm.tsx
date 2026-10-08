'use client';

import {useActionState} from 'react';

import {createRequest, type NewRequestState} from '@/lib/admin/actions/requests';
import {t} from '@/lib/admin/i18n';
import {DESTINATION_COUNTRIES, MANUAL_SOURCES, ORIGIN_COUNTRIES, SERVICE_TYPES} from '@/lib/admin/vocab';
import type {StatusRow} from '@/lib/admin/queries/requests';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function NewRequestForm({statuses, packages}: {statuses: StatusRow[]; packages: {slug: string; label: string}[]}) {
  const [state, action, pending] = useActionState<NewRequestState, FormData>(createRequest, undefined);
  const v = (name: string, fallback = '') => state?.values?.[name] ?? fallback;
  return (
    <form key={state?.values ? JSON.stringify(state.values) : 'new'} action={action} className={styles.form}>
      <h2>{t('admin.requests.new.client')}</h2>
      <div className={styles.inlineForm}>
        <div className={styles.field}>
          <label htmlFor="firstName">{t('admin.clients.first-name')}</label>
          <input id="firstName" name="firstName" defaultValue={v('firstName')} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">{t('admin.clients.last-name')}</label>
          <input id="lastName" name="lastName" defaultValue={v('lastName')} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">{t('admin.auth.email')}</label>
          <input id="email" name="email" type="email" defaultValue={v('email')} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">{t('admin.clients.phone')}</label>
          <input id="phone" name="phone" defaultValue={v('phone')} className={styles.input} placeholder="+243 …" />
        </div>
        <div className={styles.field}>
          <label htmlFor="originCountry">{t('admin.clients.origin')}</label>
          <select id="originCountry" name="originCountry" defaultValue={v('originCountry', '')} className={styles.select}>
            <option value="">—</option>
            {ORIGIN_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <h2>{t('admin.requests.new.request')}</h2>
      <div className={styles.inlineForm}>
        <div className={styles.field}>
          <label htmlFor="serviceType">{t('admin.requests.service')}</label>
          <select id="serviceType" name="serviceType" defaultValue={v('serviceType', 'assistance')} className={styles.select}>
            {SERVICE_TYPES.map((s) => (
              <option key={s.code} value={s.code}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="destination">{t('admin.requests.destination')}</label>
          <select id="destination" name="destination" defaultValue={v('destination', '')} className={styles.select}>
            <option value="">—</option>
            {DESTINATION_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="packageSlug">{t('admin.requests.package')}</label>
          <select id="packageSlug" name="packageSlug" defaultValue={v('packageSlug', '')} className={styles.select}>
            <option value="">—</option>
            {packages.map((p) => (
              <option key={p.slug} value={p.slug}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="source">{t('admin.requests.source')}</label>
          <select id="source" name="source" defaultValue={v('source', 'whatsapp')} className={styles.select}>
            {MANUAL_SOURCES.map((s) => (
              <option key={s.code} value={s.code}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="status">{t('admin.requests.status.initial')}</label>
          <select id="status" name="status" defaultValue={v('status', 'new')} className={styles.select}>
            {statuses.filter((s) => s.stage === 'open').map((s) => (
              <option key={s.code} value={s.code}>{s.label_fr}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="note">{t('admin.requests.new.note')}</label>
        <textarea id="note" name="note" defaultValue={v('note')} className={styles.textarea} />
      </div>

      <Feedback state={state} />
      {state?.matches?.length ? (
        <div className={styles.alertInfo}>
          <p>{t('admin.requests.new.matches')}</p>
          <ul className={styles.matchList}>
            {state.matches.map((m) => (
              <li key={m.id}>
                <button type="submit" name="clientId" value={m.id} className={styles.buttonSecondary}>
                  {t('admin.requests.new.use-client', {name: `${m.first_name} ${m.last_name}`})}
                </button>{' '}
                <span className={styles.muted}>{[m.email, m.phone].filter(Boolean).join(' · ')}</span>
              </li>
            ))}
          </ul>
          <label className={styles.checkLine}>
            <input type="checkbox" name="forceNew" value="true" /> {t('admin.requests.new.force')}
          </label>
        </div>
      ) : null}

      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.new.submit')}</button>
      </div>
    </form>
  );
}
