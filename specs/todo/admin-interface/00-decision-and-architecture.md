# 00 — Decision & Architecture

## 1. Current state (relevant facts from the repo)

- **Site:** Next.js 15 App Router (React 19), deployed on Netlify (`netlify.toml`, `@netlify/plugin-nextjs`). Today it is
  essentially static: no `app/api`, no middleware, no database. Content is Markdown/JSON under `data/`, read at build time
  by `lib/content.ts`.
- **Content admin:** [Sveltia CMS](../../../public/admin/index.html) at `/admin`, configured in
  `public/admin/config.yml` with the **`git-gateway`** backend (login through Netlify Identity). Editorial workflow = PRs
  to `master`. `next-sitemap.config.js` already excludes `/admin` and `/admin/*`.
- **Service request intake:** the assistance form (`src/components/AssistanceForm/*`) POSTs
  `{message, name, email, link, form:'assistance'}` to `${NEXT_PUBLIC_API_ENDPOINT}/contact-form`, an AWS API Gateway →
  Lambda → SES email (`aws/contact-form-service-aws-lambda.js`). Nothing is stored. A person who picks the free
  "information" option is only subscribed to the newsletter (no request is recorded). Structured data (package slug,
  destination, phone, origin country, service type) exists in the form's Zustand store but is flattened into a French sentence.
- **Service catalogue:** `data/services/*.md` (slug, price, labels) and `data/assistance-packages/*.md`
  (e.g. `canada/visa`, `belgique/equivalence`) — edited through the CMS, validated by git review.

## 2. The decision: Supabase (recommended) vs Netlify Database

Both are managed Postgres, so the schema in [01-data-model.md](./01-data-model.md) is portable between them. The
difference is everything *around* the database.

| Criterion | Supabase | Netlify Database |
|-----------|----------|------------------|
| What it is | Postgres + Auth + Row Level Security + Storage + dashboard (table editor, SQL editor, logs) | Managed Postgres built into Netlify (GA); dashboard with data editor, branching per deploy preview, backups/PITR |
| **Authentication for staff** | Built in (email OTP/password, TOTP MFA, invite-only). Replaces what we lose with Netlify Identity | **None** — we would bring and operate our own (e.g. Auth.js + password/OTP tables) |
| **Per-user authorisation** | Row Level Security keyed to `auth.uid()` — policies live next to the data | App code only; every query path must be hand-checked |
| **File storage** (contracts, receipts, client documents — Phase 3) | Built in, private buckets with policies | Separate service needed |
| Integration with Next.js on Netlify | `@supabase/ssr` cookie sessions; works in Netlify functions and Edge middleware | Native env wiring, auto-migrations on deploy, DB branch per deploy preview (nice) |
| Cost model | Free tier (500 MB DB; **projects pause after ~1 week of inactivity**); Pro from ~25 $/month, no pausing, daily backups | Credit-based plans only (compute + bandwidth credits); storage free until 2026-07-01 then billed |
| Familiarity | **You know it** | New to you |
| Lock-in | Low for data (plain Postgres + SQL migrations); Auth/Storage are Supabase-specific but small surface | Low for data; tied to Netlify hosting |

**Recommendation: Supabase.** The admin console is, at heart, "authenticated staff reading and writing a few
relational tables, plus private files later". Supabase gives us the auth, RLS and storage pieces off the shelf; with
Netlify Database we would have to build auth and file storage ourselves, which is where most of the risk and time
would go. Netlify's DB-branch-per-preview is attractive but is matched by using a separate Supabase *staging* project
(§6). The strongest practical reason: your familiarity — operating a database that holds applicants' personal data is
easier when you already know its tooling.

Mitigations for Supabase's downsides:
- **Pausing:** production must be on **Pro** (budget ~25 $/month, verify at purchase time). Staging may stay on Free
  (it can pause; that is acceptable).
- **Vendor coupling:** all schema is in `supabase/migrations/*.sql` (plain Postgres), data access goes through one thin
  module (`lib/admin/db/*`), so moving to another Postgres means swapping auth + storage only.

> **Decision needed from owner:** confirm Supabase + Pro plan for production. Everything below assumes yes.

## 3. Target architecture

```
Browser (staff)                 Browser (visitor)
   │  /admin/**                      │  /accompagnement (assistance form)
   ▼                                 ▼
┌──────────────────── Next.js 15 on Netlify ───────────────────────┐
│ middleware.ts   → refresh Supabase session, gate /admin/**       │
│ app/admin/**    → Server Components + Server Actions (staff UI)  │
│ app/api/requests/route.ts → public intake (zod, rate-limit)      │
└───────┬───────────────────────────────┬──────────────────────────┘
        │ user JWT (RLS enforced)       │ service-role key (server only)
        ▼                               ▼
   Supabase Postgres  ◄── RLS ──  Supabase Auth (invite-only, MFA)
   Supabase Storage (private bucket, Phase 3)

Legacy: contact-form Lambda (SES email) stays as notification path + fallback until Phase 4.
Content: Sveltia CMS (git) stays the source of truth for articles/guides/services/packages.
```

Key points:

1. **One repo, one deploy.** The console is part of the existing Next.js app under `app/admin/**` (a route group
   `app/(admin)/admin/**` if layout isolation from the public site shell is needed). No new service to host.
2. **Route clash — `/admin` is taken by the CMS** (`public/admin/index.html`). Resolution: move the CMS to **`/cms`**
   (`public/cms/index.html` + `public/cms/config.yml`) in Phase 1 (the Next route then owns `/admin`), add `/cms` to the
   `next-sitemap.config.js` excludes and to the `noindex` rules, and give the console a "Contenu" nav item pointing to `/cms`. Verify the Netlify Identity invite/recovery links still resolve
   (they land on the site root, not `/admin`); this is a Phase 1 acceptance check.
3. **Reads/writes by staff use the user's own session** so Row Level Security is the enforcement point, not just UI
   hiding. Server Actions call `createServerClient()` with the user's cookies.
4. **Public intake uses the service-role key**, only inside `app/api/requests/route.ts`. The key lives in the Netlify env
   as a non-`NEXT_PUBLIC_` variable and must never be imported by client components (enforce with a lint rule /
   `server-only` import).
5. **No heavy UI dependency.** Reuse the repo's SCSS-modules + brand tokens from the brand refresh. List pages are
   Server Components driven by URL search params (filters, sort, page) — shareable and cache-free. Add libraries only
   when a phase needs them (e.g. `@dnd-kit` for the Phase 2 board, a PDF lib for Phase 3 contracts).
6. **Dependencies added in Phase 1:** `@supabase/supabase-js`, `@supabase/ssr`, `server-only`; dev: `vitest`,
   `supabase` CLI (via `npx`). `zod`, `react-hook-form`, `date-fns` already exist.

## 4. Why content stays in git (not in the database)

Articles, guides, scholarships, services and packages are static, SEO-critical, reviewed through PRs, and rendered at
build time. Moving them to Postgres would lose version history and the editorial workflow, force the public site to
become dynamic, and re-create a CMS we already have. **Requests reference catalogue items by slug** (`package_slug =
'canada/visa'`, `service_type = 'assistance'`) as plain text validated in app code against `data/**` at write time —
no foreign keys into content.

"Managing content" from the console therefore means: a **Contenu** entry in the nav (Phase 1), a draft/publish overview
and deep links into the CMS (Phase 4), and fixing the CMS's authentication (Phase 4, §5 of that doc).

## 5. Security & privacy model

The data is personal (name, email, phone/WhatsApp, country, immigration intent), and includes people who may apply for
visas — treat it as sensitive.

- **Invite-only auth.** Disable public sign-up in Supabase. Admin invites staff by email; a `staff_profiles` row with
  role + `active` flag is required to read anything (a valid JWT alone is not enough).
- **MFA.** TOTP enrolment offered in Phase 1, **enforced for `admin` and `agent` in Phase 4**.
- **RLS on every table**, default-deny; no policy for `anon`. Policies in [01-data-model.md](./01-data-model.md).
- **Service-role key** only in the intake route; rotated on staff changes; never logged.
- **Intake hardening:** zod validation, size limits, honeypot field, per-IP rate limit, optional Cloudflare Turnstile;
  idempotency key to absorb double-submits; CORS locked to the site origin.
- **Console hygiene:** `noindex` headers + `robots` disallow, sitemap exclusion, `Cache-Control: no-store` on
  `/admin/**`, secure+HttpOnly cookies, strict CSP for `/admin/**`.
- **Audit trail:** every state-changing action writes a `request_events` row (append-only; no update/delete policy).
- **PII in logs & errors:** Sentry is already configured; scrub request bodies/emails in `beforeSend` for `/api/requests`
  and `/admin/**`.
- **Privacy policy:** update `app/politique-de-confidentialite` to state what is stored, why, where (Supabase region),
  retention, and how to request deletion — shipped with Phase 1 (intake starts storing data).
- **Personal data will live in the database (owner-confirmed)**, so the controls above are launch requirements, not
  hardening extras. The old Excel workbook is *not* imported; archive it outside the repo (restricted drive), never commit it,
  and use only synthetic fixtures in tests and docs.

## 6. Environments & deployment

| Env | Supabase project | Netlify context | Notes |
|-----|------------------|-----------------|-------|
| Local | `supabase start` (Docker) | `npm run dev` | seeded with synthetic data |
| Staging / previews | `rdcetudes-staging` (Free OK) | Deploy Previews + branch deploys | safe place to rehearse migrations and intake with synthetic data |
| Production | `rdcetudes-prod` (**Pro**) | Production | starts empty |

- Env vars (Netlify, per context): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (server-only), `ADMIN_ALLOWED_EMAIL_DOMAINS` (optional belt-and-braces), plus Turnstile keys
  if adopted. Document them in `README.md` (which currently still describes Gatsby — fix the env section in Phase 1).
- **Migrations:** `supabase/migrations/*.sql`, applied with `supabase db push` from CI on merge to `master` (staging first,
  then prod with manual approval). Never edit prod schema in the dashboard.
- **CI:** extend `.github/workflows/nodejs.yml` with `npm run lint`, `vitest`, and `supabase db lint` / pgTAP RLS tests.
- **Backups:** Pro daily backups; plus a weekly `pg_dump` to a private bucket from a scheduled GitHub Action (Phase 4
  drill documents restore).

## 7. Testing strategy

The repo has no test runner today. Phase 1 adds **Vitest** for pure logic only where bugs would hurt:
country/phone normalisation, intake payload validation and catalogue checks, status-transition rules. Database behaviour
(RLS: anon denied, viewer read-only, agent can update, only admin can delete; trigger writes events) is tested with
**pgTAP** via `supabase test db`. UI is verified manually per phase checklist, with a Playwright smoke test added in
Phase 4. Intake is exercised end-to-end on staging with synthetic data before it is enabled in production.

## 8. Risks

| Risk | Mitigation |
|------|-----------|
| Intake regression loses leads | Dual-write: Supabase first, legacy Lambda email always (fallback if Supabase fails); alert via Sentry; reconcile weekly against emails during Phase 1 soak |
| Route clash breaks CMS login | Move CMS to `/cms` in a dedicated first PR; manual login check on preview before the rest of Phase 1 |
| Supabase Free pausing | Prod on Pro |
| RLS misconfiguration leaks PII | pgTAP tests in CI; no policies for `anon`; service key confined to one route |
| Scope creep | Phase gates below; each phase has explicit non-goals |
| Netlify Identity/Git Gateway deprecation | Phase 4 migrates CMS auth to GitHub OAuth backend before it breaks |
