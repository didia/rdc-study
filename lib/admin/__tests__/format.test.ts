import {describe, expect, it} from 'vitest';

import {formatDate, zonedDayStart} from '../format';

describe('zonedDayStart', () => {
  it('starts the day at local midnight of the given zone', () => {
    expect(zonedDayStart('2026-03-10', 0, 'Africa/Kinshasa').toISOString()).toBe('2026-03-09T23:00:00.000Z');
    expect(zonedDayStart('2026-03-10', 1, 'Africa/Kinshasa').toISOString()).toBe('2026-03-10T23:00:00.000Z');
    expect(zonedDayStart('2026-01-15', 0, 'America/Toronto').toISOString()).toBe('2026-01-15T05:00:00.000Z');
  });

  it('follows daylight saving', () => {
    expect(zonedDayStart('2026-07-15', 0, 'America/Toronto').toISOString()).toBe('2026-07-15T04:00:00.000Z');
  });
});

describe('formatDate', () => {
  it('reads the instant in the office zone', () => {
    // 23:30 UTC is already the next day in Kinshasa (UTC+1).
    expect(formatDate('2026-03-09T23:30:00Z')).toContain('10');
  });
});
