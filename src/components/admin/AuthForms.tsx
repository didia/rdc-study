'use client';

import Link from 'next/link';
import {useActionState} from 'react';

import {requestPasswordReset, signIn, updatePassword} from '@/lib/admin/actions/auth';
import type {FormState} from '@/lib/admin/form-state';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';

function Feedback({state}: {state: FormState}) {
  if (state?.error) return <p className={styles.alertError} role="alert">{state.error}</p>;
  if (state?.success) return <p className={styles.alertSuccess} role="status">{state.success}</p>;
  return null;
}

export function LoginForm({next}: {next?: string}) {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="next" value={next ?? ''} />
      <div className={styles.field}>
        <label htmlFor="email">{t('admin.auth.email')}</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state?.values?.email ?? ''} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">{t('admin.auth.password')}</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={styles.input} />
      </div>
      <Feedback state={state} />
      <button type="submit" className={styles.button} disabled={pending}>
        {t('admin.auth.sign-in')}
      </button>
      <p className={styles.authFooter}>
        <Link href="/admin/mot-de-passe-oublie">{t('admin.auth.forgot')}</Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email">{t('admin.auth.email')}</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={styles.input} />
      </div>
      <Feedback state={state} />
      <button type="submit" className={styles.button} disabled={pending}>
        {t('admin.auth.send-reset')}
      </button>
      <p className={styles.authFooter}>
        <Link href="/admin/login">{t('admin.auth.back-to-login')}</Link>
      </p>
    </form>
  );
}

export function SetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="password">{t('admin.password.new')}</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required className={styles.input} />
        <span className={styles.hint}>{t('admin.password.hint')}</span>
      </div>
      <div className={styles.field}>
        <label htmlFor="confirm">{t('admin.password.confirm')}</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={12} required className={styles.input} />
      </div>
      <Feedback state={state} />
      <button type="submit" className={styles.button} disabled={pending}>
        {t('admin.password.save')}
      </button>
    </form>
  );
}
