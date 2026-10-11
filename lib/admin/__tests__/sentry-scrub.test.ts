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
    expect(out.request.url).toBe('https://www.rdcetudes.com/admin/demandes');
    expect(out.request.headers.cookie).toBeUndefined();
    expect(out.request.headers['user-agent']).toBe('x');
    expect(out.user).toBeUndefined();

    const intake: any = scrubSensitiveEvent({request: {url: 'https://x.test/api/requests', data: 'body'}} as any);
    expect(intake.request.data).toBeUndefined();
  });

  it('keeps search terms and tokens out of the whole serialized event', () => {
    const event: any = {
      request: {
        url: 'https://www.rdcetudes.com/admin/auth/callback?token_hash=SECRET-TOKEN&q=alice@example.com#access_token=SECRET-TOKEN',
        headers: {
          Cookie: 'sb=SECRET-TOKEN',
          Authorization: 'Bearer SECRET-TOKEN',
          Referer: 'https://www.rdcetudes.com/admin/demandes?q=alice@example.com',
          'user-agent': 'x',
        },
      },
      breadcrumbs: [
        {category: 'navigation', data: {from: '/admin/demandes?q=alice@example.com', to: '/admin?token_hash=SECRET-TOKEN'}},
        {category: 'fetch', data: {url: 'https://www.rdcetudes.com/admin/api?email=alice@example.com', method: 'GET'}},
        {category: 'console', message: 'hello'},
      ],
    };
    const json = JSON.stringify(scrubSensitiveEvent(event));
    expect(json).not.toContain('alice@example.com');
    expect(json).not.toContain('SECRET-TOKEN');
    expect(event.request.headers['user-agent']).toBe('x');
    expect(event.request.headers.Referer).toBe('https://www.rdcetudes.com/admin/demandes');
    expect(event.breadcrumbs[1].data.method).toBe('GET');
  });

  it('leaves public-site events untouched', () => {
    const event: any = {request: {url: 'https://www.rdcetudes.com/guides', query_string: 'a=1'}};
    expect(scrubSensitiveEvent(event).request.query_string).toBe('a=1');
  });
});
