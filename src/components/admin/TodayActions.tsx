'use client';

import {useActionState} from 'react';

import {markFollowUpDone, snoozeFollowUp} from '@/lib/admin/actions/followup';
import type {FormState} from '@/lib/admin/form-state';
import {t} from '@/lib/admin/i18n';
import {SNOOZE_CHOICES} from '@/lib/admin/followup';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

// One action state for the whole row: while any button is working all of them wait, and the message shown is always
// the latest submission's.
async function rowAction(prev: FormState, formData: FormData): Promise<FormState> {
  return formData.get('intent') === 'done' ? markFollowUpDone(prev, formData) : snoozeFollowUp(prev, formData);
}

export function TodayActions({id}: {id: string}) {
  const [state, action, pending] = useActionState(rowAction, undefined);
  return (
    <div className={styles.todayActions}>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="intent" value="done" />
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.today.done-button')}</button>
      </form>
      {SNOOZE_CHOICES.map((days) => (
        <form key={days} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="snooze" />
          <input type="hidden" name="days" value={days} />
          <button type="submit" className={styles.buttonSecondary} disabled={pending}>+{days} j</button>
        </form>
      ))}
      <form action={action} className={styles.rowForm}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="intent" value="snooze" />
        <input type="date" name="date" required className={styles.input} aria-label={t('admin.today.custom-date')} />
        <button type="submit" className={styles.buttonSecondary} disabled={pending}>{t('admin.today.snooze-custom')}</button>
      </form>
      <Feedback state={state} />
    </div>
  );
}
