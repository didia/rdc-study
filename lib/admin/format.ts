import {format, formatDistanceToNow} from 'date-fns';
import {fr} from 'date-fns/locale';

// A bare yyyy-mm-dd is a calendar day, not an instant: build it in local time so it never shifts a day.
const toDate = (iso: string) => {
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return day ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])) : new Date(iso);
};

export const formatDate = (iso: string | null | undefined) =>
  iso ? format(toDate(iso), 'd MMM yyyy', {locale: fr}) : '—';

export const formatDateTime = (iso: string | null | undefined) =>
  iso ? format(new Date(iso), "d MMM yyyy 'à' HH:mm", {locale: fr}) : '—';

export const timeAgo = (iso: string | null | undefined) =>
  iso ? formatDistanceToNow(new Date(iso), {locale: fr, addSuffix: true}) : '—';

export const formatMoney = (cents: number | null | undefined, currency = 'USD') =>
  cents == null
    ? '—'
    : new Intl.NumberFormat('fr-CA', {style: 'currency', currency, maximumFractionDigits: 0}).format(cents / 100);
