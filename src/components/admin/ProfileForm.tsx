'use client';

import {useActionState} from 'react';

import {saveProfile} from '@/lib/admin/actions/profile';
import {receivesDigest} from '@/lib/admin/digest';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function ProfileForm({profile}: {profile: {full_name: string; role: string; whatsapp: string | null; notify_new_request: boolean; notify_digest: boolean}}) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  // React resets uncontrolled fields after an action. After a failed validation the submitted values come back;
  // an unchecked box is absent from them, so absence means unchecked.
  const restored = state?.error ? state.values : undefined;
  const checked = (name: string, saved: boolean) => (restored ? name in restored : saved);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.inlineForm}>
        <div className={styles.field}>
          <label htmlFor="fullName">{t('admin.staff.name')}</label>
          <input id="fullName" name="fullName" required defaultValue={state?.values?.fullName ?? profile.full_name} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="whatsapp">{t('admin.profile.whatsapp')}</label>
          <input id="whatsapp" name="whatsapp" defaultValue={state?.values?.whatsapp ?? profile.whatsapp ?? ''} className={styles.input} placeholder="+243 …" />
        </div>
      </div>
      <h2>{t('admin.profile.notifications')}</h2>
      <label className={styles.checkLine}>
        <input type="checkbox" name="notifyNewRequest" defaultChecked={checked('notifyNewRequest', profile.notify_new_request)} /> {t('admin.profile.notify-new')}
      </label>
      {receivesDigest(profile.role) && (
        <label className={styles.checkLine}>
          <input type="checkbox" name="notifyDigest" defaultChecked={checked('notifyDigest', profile.notify_digest)} /> {t('admin.profile.notify-digest')}
        </label>
      )}
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}
