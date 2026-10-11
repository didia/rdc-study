'use client';

import {useActionState} from 'react';

import {setStaffActive, setStaffRole} from '@/lib/admin/actions/staff';
import {t} from '@/lib/admin/i18n';
import {ROLE_LABELS, STAFF_ROLES, type StaffRole} from '@/lib/admin/roles';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function StaffRoleForm({id, role, disabled}: {id: string; role: StaffRole; disabled?: boolean}) {
  const [state, action, pending] = useActionState(setStaffRole, undefined);
  return (
    <form action={action} className={styles.rowForm}>
      <input type="hidden" name="id" value={id} />
      <select name="role" defaultValue={role} className={styles.select} aria-label={t('admin.staff.role')} disabled={disabled}>
        {STAFF_ROLES.map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
      <button type="submit" className={styles.buttonSecondary} disabled={pending || disabled}>{t('admin.requests.save')}</button>
      <Feedback state={state} />
    </form>
  );
}

export function StaffActiveForm({id, active}: {id: string; active: boolean}) {
  const [state, action, pending] = useActionState(setStaffActive, undefined);
  return (
    <form action={action} className={styles.rowForm}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="active" value={String(!active)} />
      <button type="submit" className={styles.buttonSecondary} disabled={pending}>
        {active ? t('admin.staff.deactivate') : t('admin.staff.reactivate')}
      </button>
      <Feedback state={state} />
    </form>
  );
}
