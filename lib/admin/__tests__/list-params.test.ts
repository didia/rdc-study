import {describe, expect, it} from 'vitest';

import {isStale, parseListParams, searchTerms, toQueryString} from '../list-params';

describe('parseListParams', () => {
  it('applies defaults', () => {
    expect(parseListParams({})).toMatchObject({q: '', status: [], sort: 'submitted_at', dir: 'desc', page: 1});
  });

  it('reads multi-value status, dates and paging', () => {
    const p = parseListParams({status: 'new,contacted', from: '2026-01-01', to: 'nope', page: '3', sort: 'reference', dir: 'asc'});
    expect(p.status).toEqual(['new', 'contacted']);
    expect(p.from).toBe('2026-01-01');
    expect(p.to).toBe('');
    expect(p.page).toBe(3);
    expect(p.sort).toBe('reference');
    expect(p.dir).toBe('asc');
  });

  it('rejects unknown sorts and bad pages', () => {
    const p = parseListParams({sort: 'password; drop table', page: '-2'});
    expect(p.sort).toBe('submitted_at');
    expect(p.page).toBe(1);
  });

  it('round-trips through the query string', () => {
    const params = parseListParams({q: 'alice', status: ['new', 'follow_up'], assignee: 'me', page: '2'});
    expect(parseListParams(Object.fromEntries(new URLSearchParams(toQueryString(params))))).toEqual(params);
    expect(toQueryString(parseListParams({}))).toBe('');
  });
});

describe('searchTerms', () => {
  it('strips filter syntax characters', () => {
    expect(searchTerms('alice,example.com)')).toEqual(['alice', 'example.com']);
    expect(searchTerms('  a%b_c  "x" ')).toEqual(['a', 'b', 'c', 'x']);
  });
});

describe('isStale', () => {
  const now = Date.parse('2026-10-20T00:00:00Z');
  it('flags open requests quiet for more than 7 days', () => {
    expect(isStale('2026-10-10T00:00:00Z', 'open', now)).toBe(true);
    expect(isStale('2026-10-15T00:00:00Z', 'open', now)).toBe(false);
    expect(isStale('2026-01-01T00:00:00Z', 'lost', now)).toBe(false);
    expect(isStale('2026-01-01T00:00:00Z', 'won', now)).toBe(false);
  });
});
