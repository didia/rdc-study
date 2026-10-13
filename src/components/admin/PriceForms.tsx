'use client';

import {useActionState} from 'react';

import {removePriceException, savePrice} from '@/lib/admin/actions/prices';
import {t} from '@/lib/admin/i18n';
import type {FormState} from '@/lib/admin/form-state';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function PriceForm({serviceType, scope, amountCents, locked, canRemove}: {serviceType: string; scope: string; amountCents: number; locked?: boolean; canRemove?: boolean}) {
  // One state for both buttons, so the outcome of the latest action replaces an earlier one (e.g. a save error).
  const [state, action, pending] = useActionState(
    (prev: FormState, formData: FormData) => (formData.get('intent') === 'remove' ? removePriceException(prev, formData) : savePrice(prev, formData)),
    undefined,
  );
  const dollars = (amountCents / 100).toString();
  return (
    <div className={styles.priceEditor}>
      <form action={action} className={styles.priceRow} key={`${serviceType}-${scope}-${amountCents}`}>
        <input type="hidden" name="serviceType" value={serviceType} />
        <input type="hidden" name="scope" value={scope} />
        <div className={styles.field}>
          <label htmlFor={`amount-${serviceType}-${scope}`}>{t('admin.prices.amount')}</label>
          <input id={`amount-${serviceType}-${scope}`} name="amount" inputMode="decimal" defaultValue={state?.values?.amount ?? dollars} disabled={locked} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`reason-${serviceType}-${scope}`}>{t('admin.prices.reason')}</label>
          <input id={`reason-${serviceType}-${scope}`} name="reason" required minLength={3} defaultValue={state?.values?.reason ?? ''} disabled={locked} className={styles.input} />
        </div>
        <div className={styles.priceActions}>
          <button type="submit" className={styles.button} disabled={pending || locked}>{t('admin.requests.save')}</button>
          {canRemove && (
            <button type="submit" name="intent" value="remove" className={styles.buttonSecondary} disabled={pending}>
              {t('admin.prices.remove')}
            </button>
          )}
        </div>
      </form>
      <Feedback state={state} />
    </div>
  );
}

type AddProps = {options: {value: string; label: string}[]};

export function AddExceptionForm({options}: AddProps) {
  const [state, action, pending] = useActionState(savePrice, undefined);
  return (
    <form action={action} className={styles.priceRow} key={state?.success ? 'done' : 'add'}>
      <input type="hidden" name="serviceType" value="assistance" />
      <div className={styles.field}>
        <label htmlFor="exception-scope">{t('admin.prices.exception-for')}</label>
        <select id="exception-scope" name="scope" defaultValue={state?.values?.scope ?? options[0]?.value} className={styles.select}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="exception-amount">{t('admin.prices.amount')}</label>
        <input id="exception-amount" name="amount" inputMode="decimal" required defaultValue={state?.values?.amount ?? ''} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="exception-reason">{t('admin.prices.reason')}</label>
        <input id="exception-reason" name="reason" required minLength={3} defaultValue={state?.values?.reason ?? ''} className={styles.input} />
      </div>
      <div className={styles.priceActions}>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.prices.add-exception')}</button>
      </div>
      <Feedback state={state} />
    </form>
  );
}
