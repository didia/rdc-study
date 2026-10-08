import {describe, expect, it} from 'vitest';

import {parseRange, rangeBounds, rate, trendGrain} from '../dashboard';

const now = Date.parse('2026-10-20T10:00:00Z');

describe('dashboard helpers', () => {
  it('defaults to the last 90 days', () => {
    expect(parseRange({}, now)).toEqual({from: '2026-07-23', to: '2026-10-20'});
  });
  it('accepts a range and swaps it when reversed; ignores garbage', () => {
    expect(parseRange({from: '2026-01-01', to: '2026-02-01'}, now)).toEqual({from: '2026-01-01', to: '2026-02-01'});
    expect(parseRange({from: '2026-02-01', to: '2026-01-01'}, now)).toEqual({from: '2026-01-01', to: '2026-02-01'});
    expect(parseRange({from: 'x', to: 'y'}, now)).toEqual({from: '2026-07-23', to: '2026-10-20'});
  });
  it('makes the end bound exclusive', () => {
    expect(rangeBounds({from: '2026-03-01', to: '2026-03-31'})).toEqual({from: '2026-03-01T00:00:00Z', to: '2026-04-01T00:00:00.000Z'});
  });
  it('switches to months for long ranges', () => {
    expect(trendGrain({from: '2026-09-01', to: '2026-10-01'})).toBe('week');
    expect(trendGrain({from: '2025-01-01', to: '2026-01-01'})).toBe('month');
  });
  it('hides rates on small samples', () => {
    expect(rate(1, 5)).toBeNull();
    expect(rate(3, 12)).toBe(25);
  });
});
