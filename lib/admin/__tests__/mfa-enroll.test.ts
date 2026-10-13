import {describe, expect, it, vi} from 'vitest';

import {startTotpEnrollment} from '../mfa-enroll';

function mfa(all: Array<{id: string; factor_type: string; status: string}>) {
  return {
    listFactors: vi.fn(async () => ({data: {all}, error: null})),
    unenroll: vi.fn(async () => ({data: null, error: null})),
    enroll: vi.fn(async () => ({data: {id: 'new'}, error: null})),
  };
}

describe('startTotpEnrollment', () => {
  it('removes abandoned unverified TOTP factors before enrolling again', async () => {
    const api = mfa([
      {id: 'stale', factor_type: 'totp', status: 'unverified'},
      {id: 'live', factor_type: 'totp', status: 'verified'},
    ]);
    await startTotpEnrollment(api as never, 'RDC');
    expect(api.unenroll).toHaveBeenCalledTimes(1);
    expect(api.unenroll).toHaveBeenCalledWith({factorId: 'stale'});
    expect(api.enroll).toHaveBeenCalledTimes(1);
  });

  it('uses a different friendly name for each attempt', async () => {
    vi.useFakeTimers();
    const api = mfa([]);
    vi.setSystemTime(new Date('2026-10-10T10:00:00Z'));
    await startTotpEnrollment(api as never, 'RDC');
    vi.setSystemTime(new Date('2026-10-10T10:00:05Z'));
    await startTotpEnrollment(api as never, 'RDC');
    vi.useRealTimers();
    const names = api.enroll.mock.calls.map((c: any[]) => c[0].friendlyName);
    expect(new Set(names).size).toBe(2);
  });
});
