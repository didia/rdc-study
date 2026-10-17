import 'server-only';
import * as Sentry from '@sentry/nextjs';

// Optional read-only integrations. 'unconfigured' = credentials absent; 'error' = configured but the call failed
// (expired token, outage). The UI tells the two apart.
export type Integration<T> = {status: 'unconfigured'} | {status: 'error'} | {status: 'ok'; data: T};

const unconfigured = {status: 'unconfigured'} as const;
const failed = (error: unknown, area: string): {status: 'error'} => {
  // The thrown message carries the URL and status only, never the bearer token.
  Sentry.captureException(error, {tags: {area}});
  return {status: 'error'};
};

async function getJson(url: string, headers: Record<string, string>) {
  const response = await fetch(url, {headers, cache: 'no-store', signal: AbortSignal.timeout(6000)});
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  return response.json();
}

const MAX_PAGES = 10;

/** Follows `?page=N` until a short page; fails rather than silently truncating at the ceiling. */
async function getAllPages(url: string, headers: Record<string, string>, perPage: number): Promise<any[]> {
  const rows: any[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const batch = await getJson(`${url}${url.includes('?') ? '&' : '?'}per_page=${perPage}&page=${page}`, headers);
    rows.push(...batch);
    if (batch.length < perPage) return rows;
  }
  throw new Error(`${url} -> more than ${MAX_PAGES * perPage} rows`);
}

const github = () => {
  const repo = process.env.GITHUB_REPO; // "owner/name"
  const token = process.env.GITHUB_TOKEN;
  return repo && token
    ? {repo, headers: {Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'}}
    : null;
};

export type OpenPr = {number: number; title: string; url: string; branch: string; author: string; updatedAt: string};

/** Open pull requests created by the CMS editorial workflow (branches `cms/…`). */
export async function listCmsPullRequests(): Promise<Integration<OpenPr[]>> {
  const gh = github();
  if (!gh) return unconfigured;
  try {
    const prs = await getAllPages(`https://api.github.com/repos/${gh.repo}/pulls?state=open`, gh.headers, 100);
    const data = prs
      .filter((pr: any) => String(pr.head?.ref ?? '').startsWith('cms/'))
      .map((pr: any) => ({number: pr.number, title: pr.title, url: pr.html_url, branch: pr.head.ref, author: pr.user?.login ?? '', updatedAt: pr.updated_at}));
    return {status: 'ok', data};
  } catch (error) {
    return failed(error, 'integrations');
  }
}

/** GitHub accounts that can push to the repository, i.e. who can use the CMS. */
export async function listCmsCollaborators(): Promise<Integration<{login: string; permission: string}[]>> {
  const gh = github();
  if (!gh) return unconfigured;
  try {
    const people = await getAllPages(`https://api.github.com/repos/${gh.repo}/collaborators`, gh.headers, 100);
    const data = people.map((p: any) => ({login: p.login, permission: p.role_name ?? (p.permissions?.admin ? 'admin' : p.permissions?.push ? 'write' : 'read')}));
    return {status: 'ok', data};
  } catch (error) {
    return failed(error, 'integrations');
  }
}

export type DeployStatus = {state: string; branch: string; publishedAt: string | null; url: string};

/** The deploy Netlify currently serves as production (`published_deploy`); data is null when there is none. */
export async function latestProductionDeploy(): Promise<Integration<DeployStatus | null>> {
  const token = process.env.NETLIFY_API_TOKEN;
  const site = process.env.NETLIFY_SITE_ID;
  if (!token || !site) return unconfigured;
  try {
    const info = await getJson(`https://api.netlify.com/api/v1/sites/${site}`, {Authorization: `Bearer ${token}`});
    const d = info.published_deploy;
    return {status: 'ok', data: d ? {state: d.state, branch: d.branch, publishedAt: d.published_at ?? d.created_at ?? null, url: d.deploy_ssl_url ?? d.ssl_url ?? ''} : null};
  } catch (error) {
    return failed(error, 'integrations');
  }
}
