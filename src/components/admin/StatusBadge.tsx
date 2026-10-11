import type {StatusRow} from '@/lib/admin/queries/requests';
import styles from './admin.module.scss';

export function StatusBadge({status, statuses}: {status: string; statuses: StatusRow[]}) {
  const row = statuses.find((s) => s.code === status);
  const color = row?.color ?? '#667085';
  return (
    <span className={styles.statusBadge} style={{background: `${color}1f`, color}}>
      <span className={styles.statusDot} style={{background: color}} />
      {row?.label_fr ?? status}
    </span>
  );
}
