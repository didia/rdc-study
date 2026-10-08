'use client';

import {useRouter} from 'next/navigation';
import {useState, useTransition} from 'react';

import {assignMentor, setDeliveryStatus, toggleChecklistItem} from '@/lib/admin/actions/delivery';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';

type Item = {key: string; label: string; done: boolean; meta: string | null};

type Props = {
  requestId: string;
  items: Item[];
  status: string;
  canWork: boolean;
  canAssign: boolean;
  mentorId: string | null;
  mentors: {id: string; full_name: string}[];
};

export function DeliveryPanel({requestId, items, status, canWork, canAssign, mentorId, mentors}: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  const done = items.filter((i) => i.done).length;

  const run = (action: () => Promise<{error?: string}>) =>
    start(async () => {
      setError(undefined);
      const result = await action();
      if (result.error) setError(result.error);
      router.refresh();
    });

  return (
    <div className={styles.form}>
      {canAssign && (
        <div className={styles.field}>
          <label htmlFor="mentor">{t('admin.delivery.mentor')}</label>
          <select
            id="mentor"
            key={mentorId ?? 'none'}
            defaultValue={mentorId ?? ''}
            className={styles.select}
            disabled={pending}
            onChange={(e) => run(() => assignMentor({id: requestId, mentorId: e.target.value || null}))}
          >
            <option value="">{t('admin.delivery.no-mentor')}</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
        </div>
      )}

      <p>
        <strong>{t('admin.delivery.progress', {done, total: items.length})}</strong>
      </p>
      <div className={styles.barTrack} aria-hidden="true">
        <div className={styles.bar} style={{width: `${items.length ? (done / items.length) * 100 : 0}%`}} />
      </div>
      <ul className={styles.checklist}>
        {items.map((item) => (
          <li key={item.key}>
            <label className={styles.checkLine}>
              <input
                type="checkbox"
                checked={item.done}
                disabled={!canWork || pending}
                onChange={(e) => run(() => toggleChecklistItem({id: requestId, key: item.key, done: e.target.checked}))}
              />
              <span>{item.label}</span>
            </label>
            {item.meta && <small className={styles.muted}>{item.meta}</small>}
          </li>
        ))}
      </ul>

      {canWork && (
        <div className={styles.headerActions}>
          {status !== 'in_progress' && status !== 'completed' && (
            <button type="button" className={styles.buttonSecondary} disabled={pending} onClick={() => run(() => setDeliveryStatus({id: requestId, status: 'in_progress'}))}>
              {t('admin.delivery.start')}
            </button>
          )}
          {status !== 'completed' && (
            <button type="button" className={styles.button} disabled={pending} onClick={() => run(() => setDeliveryStatus({id: requestId, status: 'completed'}))}>
              {t('admin.delivery.complete')}
            </button>
          )}
        </div>
      )}
      {error && <p className={styles.alertError} role="alert">{error}</p>}
    </div>
  );
}
