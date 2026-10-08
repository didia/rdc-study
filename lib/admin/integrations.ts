import 'server-only';

// Optional read-only integrations. Each returns null when its credentials are not configured.

async function getJson(url: string, headers: Record<string, string>) {
  const response = await fetch(url, {headers, cache: 'no-store', signal: AbortSignal.timeout(6000)});
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  return response.json();
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
export async function listCmsPullRequests(): Promise<OpenPr[] | null> {
  const gh = github();
  if (!gh) return null;
  try {
    const prs = await getJson(`https://api.github.com/repos/${gh.repo}/pulls?state=open&per_page=50`, gh.headers);
    return prs
      .filter((pr: any) => String(pr.head?.ref ?? '').startsWith('cms/'))
      .map((pr: any) => ({number: pr.number, title: pr.title, url: pr.html_url, branch: pr.head.ref, author: pr.user?.login ?? '', updatedAt: pr.updated_at}));
  } catch {
    return null;
  }
}

/** GitHub accounts that can push to the repository, i.e. who can use the CMS. */
export async function listCmsCollaborators(): Promise<{login: string; permission: string}[] | null> {
  const gh = github();
  if (!gh) return null;
  try {
    const people = await getJson(`https://api.github.com/repos/${gh.repo}/collaborators?per_page=100`, gh.headers);
    return people.map((p: any) => ({login: p.login, permission: p.role_name ?? (p.permissions?.admin ? 'admin' : p.permissions?.push ? 'write' : 'read')}));
  } catch {
    return null;
  }
}

export type DeployStatus = {state: string; branch: string; publishedAt: string | null; url: string};

/** Latest production deploy of the site (Netlify). */
export async function latestProductionDeploy(): Promise<DeployStatus | null> {
  const token = process.env.NETLIFY_API_TOKEN;
  const site = process.env.NETLIFY_SITE_ID;
  if (!token || !site) return null;
  try {
    const deploys = await getJson(`https://api.netlify.com/api/v1/sites/${site}/deploys?per_page=5`, {Authorization: `Bearer ${token}`});
    const d = deploys.find((x: any) => x.context === 'production') ?? deploys[0];
    return d ? {state: d.state, branch: d.branch, publishedAt: d.published_at ?? d.created_at, url: d.deploy_ssl_url ?? d.ssl_url ?? ''} : null;
  } catch {
    return null;
  }
}
