# Phase 4 — Content Management, Notifications & Hardening

**Goal:** one coherent, supportable system: staff sign in sensibly for both requests and content, are notified when
something needs them, and the owner can trust the platform's privacy, backups and tests.

**Usable result:** admins log in to the CMS without the deprecated Netlify Identity; the console shows draft/published
content at a glance and links straight to the editor; agents get a morning digest and instant "new request" emails;
personal data is purged on schedule and can be exported/deleted on request.

Depends on Phases 1–3 in production (4.2–4.4 only need Phase 1 and can be pulled forward).

## 4.1 CMS authentication off Netlify Identity  *(highest urgency item)*

**Why:** the CMS uses `backend: git-gateway`, which relies on Netlify Identity. Netlify has deprecated Identity and Git
Gateway (no further updates/maintenance), so content editing could break without warning.

**Options considered**

| Option | Verdict |
|--------|---------|
| Keep `git-gateway` | Works today; no maintenance; unacceptable long-term risk |
| **Sveltia CMS with `github` backend + Sveltia CMS Authenticator (OAuth, hosted as a Netlify/Cloudflare function)** | **Recommended.** Sveltia already powers `/cms`; editors sign in with GitHub, commit/PR flow unchanged (editorial workflow) |
| Self-host GoTrue for Git Gateway | Extra service to run; rejected |
| Replace CMS with Supabase-backed editor | Rejected ([00 §4](./00-decision-and-architecture.md)) |

**Work**
- Create a GitHub OAuth App; deploy the Sveltia authenticator (documented in `docs/cms-auth.md`); change `public/cms/config.yml`
  backend to `github` (`repo: didia/rdc-study`, `branch: master`).
- Editors who are not developers need a GitHub account added as repo collaborators (or a fine-grained, scoped approach:
  document the trade-off and the minimum permission). Admin console's `/admin/equipe` shows a read-only "Accès au CMS"
  column listing collaborators via the GitHub API (admin token held server-side).
- Dry-run on a preview branch: create, edit, publish an article, upload an image, delete a draft.
- Decommission Netlify Identity once all editors have migrated; remove the identity widget if present.

> Cost of staying with two logins (Supabase for the console, GitHub for the CMS) is accepted: true SSO between a
> git-backed CMS and Supabase would require a custom OAuth bridge and is not worth it for a small team.

## 4.2 Content shortcuts in the console

- **`/admin/contenu`** dashboard (read-only, server-side GitHub API or build-time index from `data/**`):
  counts of published vs `draft: true` articles / guides / scholarships; list of drafts with last-modified date and a
  **"Modifier dans le CMS"** deep link (`/cms/#/collections/<name>/entries/<slug>`); open editorial-workflow PRs
  (those labelled `netlify-cms/*` / `sveltia`) with links.
- **Catalogue view:** services and assistance packages with current prices, side by side with request volume per package
  (from Phase 2 metrics) — helps decide pricing/copy changes. Read-only; editing still goes through the CMS.
- **Publish status:** shows the latest Netlify deploy status for `master` (Netlify API, read-only) so editors know when a
  published change is live.
- **Content health checks** (nice-to-have): guides marked `draft` but linked from the site, articles missing a thumbnail.

## 4.3 Notifications

- **New request email** to the owner/assigned agent via the existing SES account (or Resend if simpler), sent from the
  intake route after the DB write (retires the legacy Lambda's role as the *only* notification; Lambda kept one more
  release as fallback, then removed along with `NEXT_PUBLIC_API_ENDPOINT` contact-form usage).
- **Daily digest** (08:00 local, scheduled Netlify function or Supabase `pg_cron` → Edge Function): overdue follow-ups, new
  unassigned requests, requests stale > N days — per person.
- Per-user preferences in profile (digest on/off, instant new-request on/off).
- Optional WhatsApp group alert later (non-goal now).

## 4.4 Security hardening

- **Enforce MFA** (TOTP) for `admin`/`agent`; `mentor`/`viewer` strongly recommended. Backup codes procedure documented.
- Session lifetime & inactivity timeout (e.g. 12 h absolute / 2 h idle) for `/admin`.
- **Audit log viewer** (admin): filter `request_events` + export audit by actor/date; surface logins from Supabase auth logs.
- Review all RLS policies with a second person; re-run pgTAP; add a CI check that **fails when a new table lacks RLS**.
- Dependency & secret hygiene: rotate service-role key; secret scanning on; Dependabot already configured.
- CSP tightened with nonces; `frame-ancestors 'none'`.

## 4.5 Privacy & data lifecycle

- **Retention job:** requests closed (`lost_*`, `completed`) for > 24 months (confirm — README question 4) are anonymised:
  client name/email/phone/notes cleared or replaced with a hash; aggregate counts remain for the dashboard. Runs monthly
  (`pg_cron`), logged, with a dry-run view before first activation.
- **Subject-access tooling (admin):** export one client's data (JSON/PDF) and delete/anonymise on request, with an audit event.
- Privacy policy updated with the final retention period and a contact address for requests.
- Document the sub-processors (Supabase, Netlify, AWS SES, Sentry, Google Analytics) in the policy.

## 4.6 Reliability

- **Backups:** Pro daily backups + weekly logical dump (`pg_dump`) to a private bucket via scheduled GitHub Action.
  **Restore drill** into the staging project, documented in `supabase/RESTORE.md` and timed.
- **Monitoring:** Sentry alerts for intake errors and legacy-fallback usage; uptime check on `/api/requests/health`
  (returns 200 without touching PII); Supabase usage alert at 70 % of plan limits.
- **Playwright smoke tests** in CI (against a local Supabase): login, create request, change status, intake via API,
  assistant form happy path.
- Remove dead pieces: legacy Lambda contact-form path and `NEXT_PUBLIC_TRACK_INFORMATION_REQUESTS` flag once stable.

## Acceptance criteria

- [ ] An editor logs into `/cms` via GitHub and publishes an article end-to-end; Netlify Identity is disabled with no loss of access.
- [ ] `/admin/contenu` lists drafts and links to the correct CMS entries.
- [ ] New website request produces an email to the right person within a minute; digest arrives at 08:00 with correct counts.
- [ ] A user without MFA cannot reach request data (agent/admin).
- [ ] Retention dry-run lists exactly the expected synthetic records; real run anonymises them and the dashboard totals are unchanged.
- [ ] Restore drill completed in ≤ 1 hour with data verified.
- [ ] CI fails on a new table without RLS (verified by a deliberately failing branch).

## Non-goals

Client portal; replacing the CMS; real-time collaboration features.
