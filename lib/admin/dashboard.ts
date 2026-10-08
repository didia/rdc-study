// Pure helpers for the dashboard (date ranges, rates), kept apart from the data access so they are testable.

export const MIN_SAMPLE_FOR_RATE = 10;
const DAY = 86_400_000;

export type Range = {from: string; to: string}; // yyyy-mm-dd, `to` inclusive

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const valid = (s: string | undefined) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

export function parseRange(raw: {from?: string; to?: string}, now: number = Date.now()): Range {
  const to = valid(raw.to) ? raw.to! : isoDay(new Date(now));
  const from = valid(raw.from) ? raw.from! : isoDay(new Date(Date.parse(to) - 89 * DAY));
  return from <= to ? {from, to} : {from: to, to: from};
}

/** [from, to + 1 day) as ISO timestamps for the SQL functions. */
export function rangeBounds(range: Range): {from: string; to: string} {
  return {
    from: `${range.from}T00:00:00Z`,
    to: new Date(Date.parse(`${range.to}T00:00:00Z`) + DAY).toISOString(),
  };
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
