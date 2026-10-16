import {beforeEach, describe, expect, it, vi} from 'vitest';

type Row = {status: string; updated_at: string};

const state = vi.hoisted(() => ({
  current: {status: 'new', updated_at: 't1'} as {status: string; updated_at: string},
  updated: [] as {patch: Record<string, unknown>; filters: Record<string, unknown>}[],
}));

const STATUSES = [
  {code: 'new', stage: 'open'},
  {code: 'contacted', stage: 'open'},
  {code: 'deposit_paid', stage: 'won'},
  {code: 'lost_failed', stage: 'lost'},
];

// Just enough of the query builder for applyStatusChange: the conditional update matches only when the
// `updated_at` filter equals the row's current version, like the real optimistic-concurrency check.
const supabase = {
  from: (table: string) => {
    if (table === 'request_statuses') return {select: async () => ({data: STATUSES})};
    if (table === 'lost_reasons') {
      return {select: () => ({eq: () => ({eq: () => ({maybeSingle: async () => ({data: {code: 'too_expensive'}})})})})};
    }
    return {
      select: () => ({eq: () => ({maybeSingle: async () => ({data: state.current})})}),
      update: (patch: Record<string, unknown>) => {
        const filters: Record<string, unknown> = {};
        const builder: any = {
          eq: (key: string, value: unknown) => {
            filters[key] = value;
            return builder;
          },
          select: async () => {
            state.updated.push({patch, filters});
            const matches = filters.updated_at === undefined || filters.updated_at === state.current.updated_at;
            return {data: matches ? [{id: 'x'}] : [], error: null};
          },
        };
        return builder;
      },
    };
  },
};

vi.mock('next/navigation', () => ({redirect: vi.fn()}));
vi.mock('next/cache', () => ({revalidatePath: vi.fn()}));
vi.mock('../auth', () => ({requireStaff: vi.fn(async () => ({supabase}))}));

import {moveRequestStatus} from '../actions/requests';
import {STATUS_ERRORS} from '../status-errors';

const id = '11111111-1111-4111-8111-111111111111';

describe('board moves', () => {
  beforeEach(() => {
    state.current = {status: 'new', updated_at: 't1'};
    state.updated = [];
  });

  it('moves a card whose version is current', async () => {
    expect(await moveRequestStatus({id, status: 'contacted', updatedAt: 't1'})).toEqual({});
    expect(state.updated[0].filters.updated_at).toBe('t1');
  });

  it('refuses a stale card instead of overwriting a newer change', async () => {
    state.current = {status: 'deposit_paid', updated_at: 't2'} as Row; // another agent recorded the deposit
    const result = await moveRequestStatus({id, status: 'contacted', updatedAt: 't1'});
    expect(result.error).toBe(STATUS_ERRORS.conflict());
  });

  it('requires the card version', async () => {
    const result = await moveRequestStatus({id, status: 'contacted', updatedAt: ''});
    expect(result.error).toBe(STATUS_ERRORS.failed());
    expect(state.updated).toHaveLength(0);
  });

  it('reopens a lost card only with an explanation, and says so in French', async () => {
    state.current = {status: 'lost_failed', updated_at: 't1'};
    expect((await moveRequestStatus({id, status: 'contacted', updatedAt: 't1'})).error).toBe(STATUS_ERRORS.reopen());
    expect(await moveRequestStatus({id, status: 'contacted', updatedAt: 't1', reason: 'Le client est revenu'})).toEqual({});
    expect(state.updated[0].patch.status_reason).toBe('Le client est revenu');
  });
});
