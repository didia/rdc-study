import {format, formatDistanceToNow} from 'date-fns';
import {fr} from 'date-fns/locale';

export const formatDate = (iso: string | null | undefined) =>
  iso ? format(new Date(iso), 'd MMM yyyy', {locale: fr}) : '—';

export const formatDateTime = (iso: string | null | undefined) =>
  iso ? format(new Date(iso), "d MMM yyyy 'à' HH:mm", {locale: fr}) : '—';

export const timeAgo = (iso: string | null | undefined) =>
  iso ? formatDistanceToNow(new Date(iso), {locale: fr, addSuffix: true}) : '—';

export const formatMoney = (cents: number | null | undefined, currency = 'USD') =>
  cents == null
    ? '—'
    : new Intl.NumberFormat('fr-CA', {style: 'currency', currency, maximumFractionDigits: 0}).format(cents / 100);
