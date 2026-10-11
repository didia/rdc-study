import type {FormState} from '@/lib/admin/form-state';
import styles from './admin.module.scss';

export function Feedback({state}: {state: FormState}) {
  if (state?.error) return <p className={styles.alertError} role="alert">{state.error}</p>;
  if (state?.success) return <p className={styles.alertSuccess} role="status">{state.success}</p>;
  return null;
}
