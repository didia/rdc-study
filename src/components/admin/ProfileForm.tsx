'use client';

import {useActionState} from 'react';

import {saveProfile} from '@/lib/admin/actions/profile';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function ProfileForm({profile}: {profile: {full_name: string; whatsapp: string | null; notify_new_request: boolean; notify_digest: boolean}}) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
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
        <input type="checkbox" name="notifyNewRequest" defaultChecked={profile.notify_new_request} /> {t('admin.profile.notify-new')}
      </label>
      <label className={styles.checkLine}>
        <input type="checkbox" name="notifyDigest" defaultChecked={profile.notify_digest} /> {t('admin.profile.notify-digest')}
      </label>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}
