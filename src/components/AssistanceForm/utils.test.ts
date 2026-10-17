import {beforeEach, describe, expect, it, vi} from 'vitest';

const {post, captureMessage, captureException} = vi.hoisted(() => ({
  post: vi.fn(),
  captureMessage: vi.fn(),
  captureException: vi.fn()
}));

vi.mock('axios', () => ({default: {post}}));
vi.mock('@sentry/nextjs', () => ({captureMessage, captureException}));
vi.mock('./styles.module.scss', () => ({default: {}}));

import {submitAssistanceRequest} from './utils';

const args = {
  endpoint: '/legacy',
  message: 'm',
  name: 'N',
  email: 'n@example.test',
  link: 'l',
  intake: {email: 'n@example.test'}
};

describe('submitAssistanceRequest reporting', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reports assistance_request_not_stored when only the legacy email went through', async () => {
    post.mockImplementation((url: string) =>
      url === '/legacy' ? Promise.resolve({status: 200}) : Promise.reject(new Error('503'))
    );
    const result = await submitAssistanceRequest(args);
    expect(result).toEqual({reference: null});
    expect(captureMessage).toHaveBeenCalledWith('assistance_request_not_stored', 'warning');
  });

  it('does not put the request body in the reported error', async () => {
    const axiosError = Object.assign(new Error('Request failed'), {
      config: {data: '{"email":"n@example.test"}'},
      response: {status: 503}
    });
    post.mockImplementation((url: string) =>
      url === '/legacy' ? Promise.resolve({status: 200}) : Promise.reject(axiosError)
    );
    await submitAssistanceRequest(args);
    const [reported, options] = captureException.mock.calls[0];
    expect(JSON.stringify(reported)).not.toContain('n@example.test');
    expect(reported).not.toHaveProperty('config');
    expect(options).toEqual({tags: {area: 'intake_failed'}, extra: {status: 503}});
  });

  it('stays quiet when the request is stored', async () => {
    post.mockResolvedValue({status: 200, data: {reference: 'RDC-2026-1000'}});
    expect(await submitAssistanceRequest(args)).toEqual({reference: 'RDC-2026-1000'});
    expect(captureMessage).not.toHaveBeenCalled();
  });
});
