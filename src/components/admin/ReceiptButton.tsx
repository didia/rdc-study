'use client';

import {useRouter} from 'next/navigation';
import {useActionState, useEffect} from 'react';

import {generateReceipt} from '@/lib/admin/actions/documents';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';

export function ReceiptButton({requestId, paymentId}: {requestId: string; paymentId: string}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(generateReceipt, undefined);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={requestId} />
      <input type="hidden" name="paymentId" value={paymentId} />
      <button type="submit" className={styles.linkButton} disabled={pending}>{t('admin.documents.generate-receipt')}</button>
      {state?.error && <span className={styles.stale}> {state.error}</span>}
      {state?.success && <span className={styles.muted}> {state.success}</span>}
    </form>
  );
}
