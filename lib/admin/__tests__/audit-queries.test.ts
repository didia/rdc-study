import {describe, expect, it, vi} from 'vitest';

import {listAuditEvents, listLogins, listRequestEvents} from '../queries/audit';

// Records the filters applied to a PostgREST-style query and resolves to the given result.
function fakeQuery(result: {data: unknown[] | null; count?: number | null; error?: unknown}) {
  const calls: Array<[string, ...unknown[]]> = [];
  const q: any = new Proxy(
    {},
    {
      get(_t, prop: string) {
        if (prop === 'then') return (resolve: (v: unknown) => void) => resolve(result);
        return (...args: unknown[]) => {
          calls.push([prop, ...args]);
          return q;
        };
      },
    },
  );
  return {q, calls};
}

const filters = {actor: '', type: '', from: '2026-03-10', to: '2026-03-10', page: 1};

describe('audit day bounds', () => {
  it('uses the Kinshasa office day, not UTC midnight', () => {
    const {q, calls} = fakeQuery({data: [], count: 0});
    void listRequestEvents({from: () => ({select: () => q})} as any, filters);
    expect(calls).toContainEqual(['gte', 'created_at', '2026-03-09T23:00:00.000Z']);
    expect(calls).toContainEqual(['lt', 'created_at', '2026-03-10T23:00:00.000Z']);
  });

  it('applies the same bounds to the audit events and to the logins', async () => {
    const {q, calls} = fakeQuery({data: []});
    await listAuditEvents({from: () => ({select: () => q})} as any, filters);
    expect(calls).toContainEqual(['gte', 'created_at', '2026-03-09T23:00:00.000Z']);
    expect(calls).toContainEqual(['lt', 'created_at', '2026-03-10T23:00:00.000Z']);

    const rpc = vi.fn(async () => ({data: [], error: null}));
    await listLogins({rpc} as any, {...filters, actor: 'staff-1'});
    expect(rpc).toHaveBeenCalledWith('fn_login_events', {
      p_from: '2026-03-09T23:00:00.000Z',
      p_to: '2026-03-10T23:00:00.000Z',
      p_actor: 'staff-1',
    });
  });
});

describe('audit list errors', () => {
  it('reports a failed read instead of an empty list', async () => {
    const {q} = fakeQuery({data: null, count: null, error: {message: 'boom'}});
    const events = await listRequestEvents({from: () => ({select: () => q})} as any, filters);
    expect(events).toEqual({rows: [], total: 0, error: true});
    const logins = await listLogins({rpc: async () => ({data: null, error: {message: 'boom'}})} as any, filters);
    expect(logins).toEqual({rows: [], error: true});
  });
});
