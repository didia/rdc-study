import {describe, expect, it, vi} from 'vitest';

const listFactors = vi.hoisted(() => vi.fn());
vi.mock('../db/server', () => ({createSupabaseServiceClient: () => ({auth: {admin: {mfa: {listFactors}}}})}));

import {mfaEnrolment} from '../staff-mfa';

describe('mfaEnrolment', () => {
  it('leaves a person out when the lookup fails, so the UI shows "unknown" and not "not enrolled"', async () => {
    listFactors.mockImplementation(async ({userId}: {userId: string}) =>
      userId === 'a'
        ? {data: {factors: [{factor_type: 'totp', status: 'verified'}]}, error: null}
        : userId === 'b'
          ? {data: {factors: []}, error: null}
          : {data: null, error: {message: 'auth down'}},
    );
    expect(await mfaEnrolment(['a', 'b', 'c'])).toEqual({a: true, b: false});
  });
});
