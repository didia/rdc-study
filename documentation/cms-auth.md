# CMS sign-in without Netlify Identity

The content editor (Sveltia CMS at `/cms`) currently signs in through **Netlify Identity + Git Gateway**
(`backend: git-gateway` in `public/cms/config.yml`). Netlify has deprecated both, so this can stop working without
warning. The replacement keeps the same editor and the same editorial workflow (one pull request per change) but signs
editors in with **GitHub**.

> The console (`/admin`) and the CMS (`/cms`) therefore use two different logins. A true single sign-on between a
> git-backed CMS and Supabase would need a custom OAuth bridge; for a team this size it is not worth it.

## One-time setup

1. **GitHub OAuth App** (GitHub → Settings → Developer settings → OAuth Apps → New):
   - Homepage URL: `https://www.rdcetudes.com`
   - Authorization callback URL: `https://<authenticator-host>/callback`
   Note the *Client ID* and generate a *Client secret*.
2. **Deploy the Sveltia CMS Authenticator** (https://github.com/sveltia/sveltia-cms-auth) as a Cloudflare Worker
   (recommended, free tier) with the variables `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and
   `ALLOWED_DOMAINS=www.rdcetudes.com`. Its URL is the `base_url` below.
3. **Collaborators**: every editor needs a GitHub account added to the repository (*Settings → Collaborators*).
   Minimum permission for the editorial workflow: **Write** (it creates branches and pull requests). Prefer giving
   editors Write and keeping `master` protected so nothing is published without the PR being merged.
4. In `public/cms/config.yml` replace the backend block:

   ```yaml
   backend:
     name: github
     repo: didia/rdc-study
     branch: master
     base_url: https://<authenticator-host>
     squash_merges: true
   ```

   (Remove `accept_roles` and `git-gateway`.)

## Dry run before switching everyone

On a preview branch with the new backend: sign in with GitHub, create and publish an article, upload an image, edit an
existing guide, delete a draft. Check the PRs appear (the console's *Contenu* page lists them when `GITHUB_REPO` and
`GITHUB_TOKEN` are set).

## Switching over

1. Merge the config change, ask each editor to sign in once with GitHub.
2. When everyone has, disable Identity: Netlify → Site configuration → Identity → *Disable*. Remove any
   `netlify-identity-widget` script from pages if present.
3. Rollback: revert the config change (Identity stays enabled until step 2).

## Read-only integrations used by the console

| Variable | Used for |
|----------|----------|
| `GITHUB_REPO` (`owner/name`), `GITHUB_TOKEN` (fine-grained, read-only: *Pull requests* and *Metadata*) | pending CMS pull requests and the "Accès à l'éditeur" list on `/admin/equipe` |
| `NETLIFY_API_TOKEN`, `NETLIFY_SITE_ID` | last production deploy status on `/admin/contenu` |

None of them is required; each section shows "Non configuré" without its variables.
