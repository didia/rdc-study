'use client';

import {useActionState} from 'react';

import {markFollowUpDone, snoozeFollowUp} from '@/lib/admin/actions/followup';
import {t} from '@/lib/admin/i18n';
import {SNOOZE_CHOICES} from '@/lib/admin/followup';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function TodayActions({id}: {id: string}) {
  const [doneState, doneAction, donePending] = useActionState(markFollowUpDone, undefined);
  const [snoozeState, snoozeAction, snoozePending] = useActionState(snoozeFollowUp, undefined);
  return (
    <div className={styles.todayActions}>
      <form action={doneAction}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={styles.button} disabled={donePending}>{t('admin.today.done-button')}</button>
      </form>
      {SNOOZE_CHOICES.map((days) => (
        <form key={days} action={snoozeAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="days" value={days} />
          <button type="submit" className={styles.buttonSecondary} disabled={snoozePending}>+{days} j</button>
        </form>
      ))}
      <form action={snoozeAction} className={styles.rowForm}>
        <input type="hidden" name="id" value={id} />
        <input type="date" name="date" required className={styles.input} aria-label={t('admin.today.custom-date')} />
        <button type="submit" className={styles.buttonSecondary} disabled={snoozePending}>{t('admin.today.snooze-custom')}</button>
      </form>
      <Feedback state={doneState ?? snoozeState} />
    </div>
  );
}
