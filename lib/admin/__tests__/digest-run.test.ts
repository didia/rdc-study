import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('@sentry/nextjs', () => ({captureException: vi.fn()}));
const sendEmail = vi.fn();
const staffEmail = vi.fn();
vi.mock('../notify', () => ({sendEmail: (...a: unknown[]) => sendEmail(...a), staffEmail: (...a: unknown[]) => staffEmail(...a), siteBaseUrl: () => 'https://x.test'}));

import {runDigest} from '../digest-run';

type Result = {data: unknown; error: unknown};
// Minimal PostgREST stand-in: every builder method returns itself and awaiting yields the table's result.
function fakeService(tables: Record<string, Result | Result[]>) {
  const calls: Record<string, number> = {};
  return {
    from(table: string) {
      const entry = tables[table];
      const result = () => (Array.isArray(entry) ? entry[Math.min((calls[table] = (calls[table] ?? 0) + 1) - 1, entry.length - 1)] : entry);
      const builder: any = new Proxy({}, {get: (_t, prop) => (prop === 'then' ? (resolve: (v: Result) => void) => resolve(result()) : () => builder)});
      return builder;
    },
  } as any;
}

const statuses = {data: [{code: 'new', stage: 'open'}], error: null};
const staff = {data: [{id: 'u1', full_name: 'Ada Lovelace', role: 'agent'}, {id: 'u2', full_name: 'Bob Ray', role: 'agent'}], error: null};
const overdue = (assigned_to: string) => ({id: assigned_to, reference: 'R', status: 'new', assigned_to, next_follow_up_at: '2020-01-01T00:00:00Z', last_activity_at: '2020-01-01T00:00:00Z', client: null});

describe('runDigest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    staffEmail.mockResolvedValue('a@x.test');
    sendEmail.mockResolvedValue(true);
  });

  it('throws on a failed read instead of reporting an empty send', async () => {
    const failing = fakeService({request_statuses: statuses, staff_profiles: {data: null, error: new Error('column does not exist')}});
    await expect(runDigest(failing)).rejects.toThrow('column does not exist');
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('throws when the open-request read fails', async () => {
    const failing = fakeService({request_statuses: statuses, staff_profiles: staff, service_requests: {data: null, error: new Error('timeout')}});
    await expect(runDigest(failing)).rejects.toThrow('timeout');
  });

  it('refuses to mail a list truncated at the page ceiling', async () => {
    const page = {data: Array.from({length: 1000}, () => overdue('u1')), error: null};
    await expect(runDigest(fakeService({request_statuses: statuses, staff_profiles: staff, service_requests: page}))).rejects.toThrow('more than');
  });

  it('keeps sending after one recipient fails and counts the failure', async () => {
    staffEmail.mockRejectedValueOnce(new Error('auth down'));
    const service = fakeService({request_statuses: statuses, staff_profiles: staff, service_requests: {data: [overdue('u1'), overdue('u2')], error: null}});
    expect(await runDigest(service)).toEqual({sent: 1, failed: 1});
  });
});
