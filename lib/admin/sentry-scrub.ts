import type {ErrorEvent} from '@sentry/nextjs';

const SENSITIVE_PATHS = ['/admin', '/api/requests'];

// Personal data (names, emails, phones, immigration intent) must not end up in Sentry:
// drop request bodies, cookies and query strings for the console and the intake route.
export function scrubSensitiveEvent<T extends ErrorEvent>(event: T): T {
  const url = event.request?.url ?? '';
  let pathname = '';
  try {
    pathname = new URL(url, 'http://localhost').pathname;
  } catch {
    // keep empty
  }
  if (!SENSITIVE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return event;

  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.query_string;
    if (event.request.headers) {
      delete event.request.headers['cookie'];
      delete event.request.headers['authorization'];
    }
  }
  delete event.user;
  return event;
}
