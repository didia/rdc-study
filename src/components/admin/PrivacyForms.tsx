'use client';

import {useActionState} from 'react';

import {runRetentionNow, saveRetentionSettings} from '@/lib/admin/actions/privacy';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function RetentionSettingsForm({months, auto}: {months: number; auto: boolean}) {
  const [state, action, pending] = useActionState(saveRetentionSettings, undefined);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="months">{t('admin.privacy.months')}</label>
        <input id="months" name="months" type="number" min={6} max={120} required defaultValue={months} className={styles.input} />
        <span className={styles.hint}>{t('admin.privacy.months-hint')}</span>
      </div>
      <label className={styles.checkLine}>
        <input type="checkbox" name="auto" defaultChecked={auto} /> {t('admin.privacy.auto')}
      </label>
      <p className={styles.hint}>{t('admin.privacy.auto-hint')}</p>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}

export function RunRetentionForm({months, disabled}: {months: number; disabled: boolean}) {
  const [state, action, pending] = useActionState(runRetentionNow, undefined);
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="months" value={months} />
      <label className={styles.checkLine}>
        <input type="checkbox" name="confirm" value="yes" required /> {t('admin.privacy.confirm')}
      </label>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending || disabled}>{t('admin.privacy.run')}</button>
      </div>
    </form>
  );
}
