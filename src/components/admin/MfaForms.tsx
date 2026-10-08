'use client';

import {useRouter} from 'next/navigation';
import {useState, type FormEvent} from 'react';

import {createSupabaseBrowserClient} from '@/lib/admin/db/browser';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';

// Second factor after sign-in (user has a verified TOTP factor but the session is aal1).
export function MfaChallengeForm({next}: {next: string}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    const code = String(new FormData(event.currentTarget).get('code') ?? '').replace(/\s/g, '');
    const supabase = createSupabaseBrowserClient();
    const {data: factors} = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp?.[0];
    if (!factor) {
      setError(t('admin.mfa.no-factor'));
      setPending(false);
      return;
    }
    const {data: challenge, error: challengeError} = await supabase.auth.mfa.challenge({factorId: factor.id});
    const {error: verifyError} = challengeError || !challenge
      ? {error: challengeError}
      : await supabase.auth.mfa.verify({factorId: factor.id, challengeId: challenge.id, code});
    if (verifyError) {
      setError(t('admin.mfa.invalid-code'));
      setPending(false);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="code">{t('admin.mfa.code')}</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required className={styles.input} autoFocus />
      </div>
      {error && <p className={styles.alertError} role="alert">{error}</p>}
      <button type="submit" className={styles.button} disabled={pending}>
        {t('admin.mfa.verify')}
      </button>
    </form>
  );
}

type Enrollment = {factorId: string; qrCode: string; secret: string};

export function MfaEnroll() {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<Enrollment>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function start() {
    setPending(true);
    setError(undefined);
    const supabase = createSupabaseBrowserClient();
    const {data, error: enrollError} = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `RDC Études ${new Date().toISOString().slice(0, 10)}`,
    });
    setPending(false);
    if (enrollError || !data) {
      setError(t('admin.mfa.enroll-failed'));
      return;
    }
    setEnrollment({factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret});
  }

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enrollment) return;
    setPending(true);
    setError(undefined);
    const code = String(new FormData(event.currentTarget).get('code') ?? '').replace(/\s/g, '');
    const supabase = createSupabaseBrowserClient();
    const {data: challenge, error: challengeError} = await supabase.auth.mfa.challenge({factorId: enrollment.factorId});
    const {error: verifyError} = challengeError || !challenge
      ? {error: challengeError}
      : await supabase.auth.mfa.verify({factorId: enrollment.factorId, challengeId: challenge.id, code});
    setPending(false);
    if (verifyError) {
      setError(t('admin.mfa.invalid-code'));
      return;
    }
    setEnrollment(undefined);
    router.refresh();
  }

  if (!enrollment) {
    return (
      <div className={styles.form}>
        {error && <p className={styles.alertError} role="alert">{error}</p>}
        <div>
          <button type="button" className={styles.button} onClick={start} disabled={pending}>
            {t('admin.mfa.enroll')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={confirm} className={styles.form}>
      <p>{t('admin.mfa.scan')}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={enrollment.qrCode} alt={t('admin.mfa.qr-alt')} className={styles.qr} />
      <p className={styles.hint}>
        {t('admin.mfa.manual')} <span className={styles.secret}>{enrollment.secret}</span>
      </p>
      <div className={styles.field}>
        <label htmlFor="code">{t('admin.mfa.code')}</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required className={styles.input} />
      </div>
      {error && <p className={styles.alertError} role="alert">{error}</p>}
      <button type="submit" className={styles.button} disabled={pending}>
        {t('admin.mfa.confirm')}
      </button>
    </form>
  );
}
