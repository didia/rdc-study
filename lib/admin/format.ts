import {format, formatDistanceToNow} from 'date-fns';
import {fr} from 'date-fns/locale';

// The office's calendar: dates shown in the console and date filters are both read in this zone,
// whatever timezone the server process or the browser happens to use.
export const ADMIN_TIMEZONE = process.env.ADMIN_TIMEZONE || 'Africa/Kinshasa';

// Offset (ms) of `timeZone` from UTC at the given instant.
function zoneOffset(instant: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return wall - Math.floor(instant / 1000) * 1000;
}

/** UTC instant at which calendar day `ymd` (yyyy-mm-dd) starts in `timeZone`; `plusDays` shifts the day first. */
export function zonedDayStart(ymd: string, plusDays = 0, timeZone = ADMIN_TIMEZONE): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d + plusDays);
  let instant = guess - zoneOffset(guess, timeZone);
  instant = guess - zoneOffset(instant, timeZone); // second pass settles DST edges
  return new Date(instant);
}

// date-fns formats with local fields, so rebuild the office's wall clock as a local Date first.
function inAdminZone(iso: string): Date {
  const instant = new Date(iso).getTime();
  const wall = new Date(instant + zoneOffset(instant, ADMIN_TIMEZONE));
  return new Date(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate(), wall.getUTCHours(), wall.getUTCMinutes(), wall.getUTCSeconds());
}

export const formatDate = (iso: string | null | undefined) =>
  iso ? format(inAdminZone(iso), 'd MMM yyyy', {locale: fr}) : '—';

export const formatDateTime = (iso: string | null | undefined) =>
  iso ? format(inAdminZone(iso), "d MMM yyyy 'à' HH:mm", {locale: fr}) : '—';

export const timeAgo = (iso: string | null | undefined) =>
  iso ? formatDistanceToNow(new Date(iso), {locale: fr, addSuffix: true}) : '—';

export const formatMoney = (cents: number | null | undefined, currency = 'USD') =>
  cents == null
    ? '—'
    : new Intl.NumberFormat('fr-CA', {style: 'currency', currency, maximumFractionDigits: 0}).format(cents / 100);
