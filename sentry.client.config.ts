import * as Sentry from '@sentry/nextjs';

import {scrubSensitiveEvent} from './lib/admin/sentry-scrub';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_URL,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  beforeSend: scrubSensitiveEvent,
});
