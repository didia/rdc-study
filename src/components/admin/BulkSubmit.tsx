'use client';

import {useFormStatus} from 'react-dom';

import styles from './admin.module.scss';

// A submit button of the bulk bar; disabled while any bulk action is in flight so a double click cannot run it twice.
export function BulkSubmit({value, children}: {value: string; children: React.ReactNode}) {
  const {pending} = useFormStatus();
  return (
    <button type="submit" name="bulk" value={value} className={styles.buttonSecondary} disabled={pending}>
      {children}
    </button>
  );
}
