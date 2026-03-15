import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_URL,
      enabled: process.env.NODE_ENV === 'production',
      tracesSampleRate: 0.1,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
