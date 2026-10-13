// Pure helpers for the dashboard (date ranges, rates), kept apart from the data access so they are testable.
// Days are the office's calendar days (ADMIN_TIMEZONE), like the request list's date filters.

import {adminDay, zonedDayStart} from './format';

export const MIN_SAMPLE_FOR_RATE = 10;
const DAY = 86_400_000;

export type Range = {from: string; to: string}; // yyyy-mm-dd, `to` inclusive

const valid = (s: string | undefined) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

export function parseRange(raw: {from?: string; to?: string}, now: number = Date.now()): Range {
  const to = valid(raw.to) ? raw.to! : adminDay(new Date(now).toISOString());
  const from = valid(raw.from) ? raw.from! : new Date(Date.parse(to) - 89 * DAY).toISOString().slice(0, 10);
  return from <= to ? {from, to} : {from: to, to: from};
}

/** [start of `from`, start of the day after `to`) in the office calendar, as ISO instants for the SQL functions. */
export function rangeBounds(range: Range): {from: string; to: string} {
  return {from: zonedDayStart(range.from).toISOString(), to: zonedDayStart(range.to, 1).toISOString()};
}

export const trendGrain = (range: Range): 'week' | 'month' =>
  (Date.parse(range.to) - Date.parse(range.from)) / DAY > 120 ? 'month' : 'week';

/** Percentage, or null when the sample is too small to mean anything (counts are always shown next to it). */
export function rate(part: number, total: number): number | null {
  if (total < MIN_SAMPLE_FOR_RATE) return null;
  return Math.round((part / total) * 1000) / 10;
}

export const DIMENSIONS = ['destination', 'package', 'origin', 'service', 'source', 'assignee'] as const;
export type Dimension = (typeof DIMENSIONS)[number];
