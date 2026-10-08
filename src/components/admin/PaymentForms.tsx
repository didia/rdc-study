'use client';

import {useRouter} from 'next/navigation';
import {useActionState, useState, useTransition} from 'react';

import {recordPayment, setAgreedPrice, voidPayment} from '@/lib/admin/actions/payments';
import {moveRequestStatus} from '@/lib/admin/actions/requests';
import {t} from '@/lib/admin/i18n';
import {CURRENCIES, PAYMENT_KINDS, PAYMENT_METHODS} from '@/lib/admin/money';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

const today = () => new Date().toISOString().slice(0, 10);

export function RecordPaymentForm({requestId, defaultCurrency}: {requestId: string; defaultCurrency: string}) {
  const [state, action, pending] = useActionState(recordPayment, undefined);
  const v = (name: string, fallback = '') => state?.values?.[name] ?? fallback;
  return (
    <form action={action} className={styles.form} key={state?.success ? 'recorded' : JSON.stringify(state?.values ?? {})}>
      <input type="hidden" name="id" value={requestId} />
      <div className={styles.inlineForm}>
        <div className={styles.field}>
          <label htmlFor="kind">{t('admin.payments.kind')}</label>
          <select id="kind" name="kind" defaultValue={v('kind', 'deposit')} className={styles.select}>
            {PAYMENT_KINDS.map((k) => (
              <option key={k.code} value={k.code}>{k.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="amount">{t('admin.payments.amount')}</label>
          <input id="amount" name="amount" inputMode="decimal" required defaultValue={v('amount')} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="currency">{t('admin.payments.currency')}</label>
          <select id="currency" name="currency" defaultValue={v('currency', defaultCurrency)} className={styles.select}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="method">{t('admin.payments.method')}</label>
          <select id="method" name="method" defaultValue={v('method', 'mobile_money')} className={styles.select}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.code} value={m.code}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="paidAt">{t('admin.payments.date')}</label>
          <input id="paidAt" name="paidAt" type="date" required defaultValue={v('paidAt', today())} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="externalRef">{t('admin.payments.reference')}</label>
          <input id="externalRef" name="externalRef" defaultValue={v('externalRef')} className={styles.input} placeholder={t('admin.payments.reference-hint')} />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="note">{t('admin.payments.note')}</label>
        <input id="note" name="note" defaultValue={v('note')} className={styles.input} />
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.payments.record')}</button>
      </div>
    </form>
  );
}

export function VoidPaymentForm({requestId, paymentId}: {requestId: string; paymentId: string}) {
  const [state, action, pending] = useActionState(voidPayment, undefined);
  return (
    <details className={styles.details}>
      <summary>{t('admin.payments.void')}</summary>
      <form action={action} className={styles.rowForm}>
        <input type="hidden" name="id" value={requestId} />
        <input type="hidden" name="paymentId" value={paymentId} />
        <input name="reason" required minLength={3} className={styles.input} placeholder={t('admin.payments.void-reason')} aria-label={t('admin.payments.void-reason')} />
        <button type="submit" className={styles.buttonSecondary} disabled={pending}>{t('admin.payments.void-confirm')}</button>
        <Feedback state={state} />
      </form>
    </details>
  );
}

export function AgreedPriceForm({requestId, quotedCents, agreedCents, currency}: {requestId: string; quotedCents: number | null; agreedCents: number | null; currency: string}) {
  const [state, action, pending] = useActionState(setAgreedPrice, undefined);
  const current = agreedCents ?? quotedCents;
  return (
    <details className={styles.details}>
      <summary>{t('admin.payments.change-agreed')}</summary>
      <form action={action} className={styles.form}>
        <input type="hidden" name="id" value={requestId} />
        <div className={styles.inlineForm}>
          <div className={styles.field}>
            <label htmlFor="agreed-amount">{t('admin.payments.amount')}</label>
            <input id="agreed-amount" name="amount" inputMode="decimal" defaultValue={current != null ? String(current / 100) : ''} className={styles.input} />
          </div>
          <div className={styles.field}>
            <label htmlFor="agreed-currency">{t('admin.payments.currency')}</label>
            <select id="agreed-currency" name="currency" defaultValue={currency} className={styles.select}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="agreed-reason">{t('admin.payments.override-reason')}</label>
            <input id="agreed-reason" name="reason" className={styles.input} />
          </div>
        </div>
        <p className={styles.hint}>{t('admin.payments.override-hint')}</p>
        <Feedback state={state} />
        <div>
          <button type="submit" className={styles.buttonSecondary} disabled={pending}>{t('admin.requests.save')}</button>
        </div>
      </form>
    </details>
  );
}

// One click, never silent: staff confirm the money really arrived before the status moves.
export function SuggestionBanner({requestId, status, label, amounts}: {requestId: string; status: string; label: string; amounts: string}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  return (
    <div className={styles.alertInfo} role="status" style={{marginBottom: 16}}>
      <p>{t('admin.payments.suggestion', {amounts, status: label})}</p>
      <button
        type="button"
        className={styles.button}
        disabled={pending}
        onClick={() =>
          start(async () => {
            const result = await moveRequestStatus({id: requestId, status});
            if (result.error) setError(result.error);
            router.refresh();
          })
        }
      >
        {t('admin.payments.suggestion-apply', {status: label})}
      </button>
      {error && <p className={styles.alertError} role="alert">{error}</p>}
    </div>
  );
}
