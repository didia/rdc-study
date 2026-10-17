import type {ErrorEvent} from '@sentry/nextjs';

const SENSITIVE_PATHS = ['/admin', '/api/requests'];

// Headers that carry credentials (dropped) or a URL that can echo the query string (stripped).
const DROPPED_HEADERS = new Set(['cookie', 'set-cookie', 'authorization', 'proxy-authorization']);
const URL_HEADERS = new Set(['referer', 'referrer', 'origin', 'location', 'x-forwarded-url', 'x-original-url']);
const URL_BREADCRUMB_KEYS = ['url', 'from', 'to'];

// Query strings and fragments carry search terms (emails, names) and one-time auth tokens.
function stripQuery(value: string): string {
  return value.split(/[?#]/, 1)[0];
}

function scrubUrlFields(bag: Record<string, unknown> | undefined) {
  if (!bag) return;
  for (const key of URL_BREADCRUMB_KEYS) {
    if (typeof bag[key] === 'string') bag[key] = stripQuery(bag[key] as string);
  }
}

// Personal data (names, emails, phones, immigration intent) must not end up in Sentry: drop
// request bodies, cookies and credentials, and strip query strings from every URL the event
// carries (request URL, URL-bearing headers, breadcrumbs) for the console and the intake route.
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
    if (event.request.url) event.request.url = stripQuery(event.request.url);
    const headers = event.request.headers as Record<string, string> | undefined;
    if (headers) {
      for (const name of Object.keys(headers)) {
        const lower = name.toLowerCase();
        if (DROPPED_HEADERS.has(lower)) delete headers[name];
        else if (URL_HEADERS.has(lower) && typeof headers[name] === 'string') headers[name] = stripQuery(headers[name]);
      }
    }
  }
  for (const crumb of event.breadcrumbs ?? []) scrubUrlFields(crumb.data);
  delete event.user;
  return event;
}
