'use client';

import {useActionState} from 'react';

import {inviteStaff} from '@/lib/admin/actions/auth';
import {t} from '@/lib/admin/i18n';
import {ROLE_LABELS, STAFF_ROLES} from '@/lib/admin/roles';
import styles from './admin.module.scss';

export function InviteStaffForm() {
  const [state, action, pending] = useActionState(inviteStaff, undefined);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.inlineForm}>
        <div className={styles.field}>
          <label htmlFor="fullName">{t('admin.staff.name')}</label>
          <input id="fullName" name="fullName" required minLength={2} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">{t('admin.auth.email')}</label>
          <input id="email" name="email" type="email" required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="role">{t('admin.staff.role')}</label>
          <select id="role" name="role" defaultValue="agent" className={styles.select}>
            {STAFF_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state?.error && <p className={styles.alertError} role="alert">{state.error}</p>}
      {state?.success && <p className={styles.alertSuccess} role="status">{state.success}</p>}
      <div>
        <button type="submit" className={styles.button} disabled={pending}>
          {t('admin.staff.invite.submit')}
        </button>
      </div>
    </form>
  );
}
