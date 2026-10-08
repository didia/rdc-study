import {describe, expect, it} from 'vitest';

import {scrubSensitiveEvent} from '../sentry-scrub';

describe('scrubSensitiveEvent', () => {
  it('strips personal data from console and intake events', () => {
    const event: any = {
      request: {
        url: 'https://www.rdcetudes.com/admin/demandes?q=alice@example.com',
        data: {email: 'alice@example.com'},
        cookies: {sb: 'secret'},
        query_string: 'q=alice@example.com',
        headers: {cookie: 'sb=secret', 'user-agent': 'x'},
      },
      user: {email: 'alice@example.com'},
    };
    const out: any = scrubSensitiveEvent(event);
    expect(out.request.data).toBeUndefined();
    expect(out.request.cookies).toBeUndefined();
    expect(out.request.query_string).toBeUndefined();
    expect(out.request.headers.cookie).toBeUndefined();
    expect(out.request.headers['user-agent']).toBe('x');
    expect(out.user).toBeUndefined();

    const intake: any = scrubSensitiveEvent({request: {url: 'https://x.test/api/requests', data: 'body'}} as any);
    expect(intake.request.data).toBeUndefined();
  });

  it('leaves public-site events untouched', () => {
    const event: any = {request: {url: 'https://www.rdcetudes.com/guides', query_string: 'a=1'}};
    expect(scrubSensitiveEvent(event).request.query_string).toBe('a=1');
  });
});
