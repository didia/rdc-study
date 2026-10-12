import {describe, expect, it, vi} from 'vitest';

import {turnstileOk} from '../turnstile';

const stub = (success: boolean) => vi.fn(async () => ({json: async () => ({success})}) as Response) as unknown as typeof fetch;

describe('turnstileOk', () => {
  it('is off when nothing is configured', async () => {
    expect(await turnstileOk(undefined, '', {})).toBe(true);
  });

  it('stays off with the secret alone: the form cannot send a token yet', async () => {
    const fetchImpl = stub(true);
    expect(await turnstileOk(undefined, '', {TURNSTILE_SECRET_KEY: 's'}, fetchImpl)).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  const on = {TURNSTILE_SECRET_KEY: 's', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'k'};

  it('rejects a payload without a token once enabled', async () => {
    expect(await turnstileOk(undefined, '', on, stub(true))).toBe(false);
  });

  it('accepts when the verification succeeds and rejects when it fails or errors', async () => {
    expect(await turnstileOk('tok', '1.2.3.4', on, stub(true))).toBe(true);
    expect(await turnstileOk('tok', '1.2.3.4', on, stub(false))).toBe(false);
    expect(await turnstileOk('tok', '', on, (async () => { throw new Error('down'); }) as typeof fetch)).toBe(false);
  });
});
