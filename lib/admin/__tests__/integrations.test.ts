import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('@sentry/nextjs', () => ({captureException: vi.fn()}));

import * as Sentry from '@sentry/nextjs';

import {latestProductionDeploy, listCmsPullRequests} from '../integrations';

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status});

describe('integrations', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_REPO', 'o/r');
    vi.stubEnv('GITHUB_TOKEN', 'secret-token');
    vi.stubEnv('NETLIFY_API_TOKEN', 'nt');
    vi.stubEnv('NETLIFY_SITE_ID', 'site1');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('is unconfigured, not failed, when credentials are absent', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    vi.stubEnv('NETLIFY_SITE_ID', '');
    expect(await listCmsPullRequests()).toEqual({status: 'unconfigured'});
    expect(await latestProductionDeploy()).toEqual({status: 'unconfigured'});
  });

  it('reports an API failure as an error and logs it, without the token', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => reply({}, 401)));
    expect(await listCmsPullRequests()).toEqual({status: 'error'});
    const logged = vi.mocked(Sentry.captureException).mock.calls[0][0] as Error;
    expect(logged.message).toContain('401');
    expect(logged.message).not.toContain('secret-token');
  });

  it('follows pagination and keeps only cms/ branches', async () => {
    const pr = (n: number, ref: string) => ({number: n, title: `t${n}`, html_url: '', head: {ref}, user: {login: 'u'}, updated_at: ''});
    const full = Array.from({length: 100}, (_, i) => pr(i, i === 0 ? 'other' : 'feature/x'));
    const fetchMock = vi.fn().mockResolvedValueOnce(reply(full)).mockResolvedValueOnce(reply([pr(200, 'cms/articles/a')]));
    vi.stubGlobal('fetch', fetchMock);
    const result = await listCmsPullRequests();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({status: 'ok', data: [{number: 200}]});
  });

  it('reads the published deploy and never substitutes a preview', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => reply({published_deploy: {state: 'ready', branch: 'main', published_at: '2026-10-01T00:00:00Z'}})));
    expect(await latestProductionDeploy()).toMatchObject({status: 'ok', data: {state: 'ready', branch: 'main'}});
    vi.stubGlobal('fetch', vi.fn(async () => reply({published_deploy: null})));
    expect(await latestProductionDeploy()).toEqual({status: 'ok', data: null});
  });
});
