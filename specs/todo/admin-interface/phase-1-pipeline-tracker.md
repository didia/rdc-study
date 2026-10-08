# Phase 1 — Pipeline Tracker (replace the Excel file)

**Goal:** by the end of this phase the team works from the console instead of the spreadsheet. New requests from the website appear in the
console on their own; staff can find any request, see its whole story, move it through the same stages the tabs
represented, and know who owns it.

**Usable result:** sign in at `/admin` → see every new website request (the console starts empty — clean start, no history imported) → search/filter → open a
request → change status / add a note / assign → history is kept automatically.

Depends on: [00](./00-decision-and-architecture.md), [01](./01-data-model.md).

## Delivery in three PRs

Each PR is independently mergeable and leaves `master` deployable.

| PR | Contents | Why separate |
|----|----------|--------------|
| **1A — Foundations** | Move CMS to `/cms`; Supabase projects + `supabase/` migrations (P1 tables, seeds, triggers, RLS) + pgTAP tests; `@supabase/ssr` clients; `middleware.ts`; `/admin/login`, `/admin` shell, staff invite flow; CI additions; README env docs; privacy-policy text | Highest-risk plumbing (route clash, auth, RLS) reviewed on its own; nothing user-visible on the public site changes |
| **1B — Console** | Requests list (search/filter/sort/paginate), request detail (timeline, status change, notes, assign, edit fields), "New request" manual form, clients view, staff management page (admin), Contenu link | Pure console UI on top of 1A |
| **1C — Live intake** | `POST /api/requests` + `submit_service_request()`; form dual-write; price source-of-truth fix (300 $); cut-over checklist | Touches the public form, so it ships last, after the console is proven on staging |

## Scope

### 1A — Foundations

1. **Relocate the CMS.** `public/admin/{index.html,config.yml}` → `public/cms/`. Add `/cms` to
   `next-sitemap.config.js` `exclude`. Acceptance: on the deploy preview, `/cms` loads Sveltia and a CMS editor can log in
   through Netlify Identity and open an article (manual check — record in PR).
2. **Supabase setup** (runbook committed in `supabase/README.md`): create staging + prod projects, disable public
   sign-ups, set Site URL + redirect URLs (`/admin/auth/callback`), set the auth email templates in French, region closest to
   users/staff (document choice; privacy policy mentions it).
3. **Migrations:** exactly the P1 objects in [01 §3–§6](./01-data-model.md) + seed statuses. Included pgTAP tests.
4. **Auth:** email + password with TOTP MFA *enrolment available* (not enforced yet); password reset; invite flow
   (admin creates user in `/admin/staff` → Supabase invite → first login sets password → `staff_profiles` row created by
   the admin action, role chosen at invite time). `middleware.ts` refreshes the session and redirects unauthenticated
   `/admin/**` to `/admin/login`; pages additionally verify an *active* `staff_profiles` row (no profile ⇒ "Accès non
   autorisé" page).
5. **App shell** `app/(admin)/admin/layout.tsx`: sidebar (Demandes, Clients, Contenu → `/cms`, Équipe [admin only]),
   header with user menu (profile, enrol MFA, sign out). French UI strings in `src/locales/fr.json` under `admin.*`.
   Responsive down to tablet; usable on a phone for quick lookups.
6. **Hygiene:** `noindex` metadata + `X-Robots-Tag` header and `Cache-Control: no-store` for `/admin/**` (via
   `next.config.mjs` `headers()`), `robots.txt` disallow, CSP header for `/admin/**`.
7. **Tooling:** Vitest config, `npm run test`, CI runs lint + test + `supabase db lint`/`supabase test db`.
   Fix README: replace the stale Gatsby run/env instructions with the Next.js ones including the new variables.

### 1B — Console

**Requests list — `/admin/demandes`**
- Server-rendered table driven by URL params: `q` (name/email/phone/reference, trigram search), `status` (multi),
  `service`, `destination`, `origin`, `assignee` (incl. "Non assignée" and "Moi"), `source`, `from`/`to` (submitted date),
  `sort` (default `submitted_at desc`), `page` (25/page).
- Columns: reference, client (name + origin country), service + package, destination, status badge, assignee, submitted,
  last activity ("il y a 3 j"), stale marker (open request with no activity > 7 days).
- Status "pills" with counts above the table — the direct replacement for the spreadsheet's tabs (Nouvelle, Contact
  initial, Relancé, En discussion, …). Clicking one sets the `status` filter.
- Bulk actions (agent+): assign to…, change status (with common reason). Each applies per-row so triggers log each event.

**Request detail — `/admin/demandes/[id]`**
- Header: reference, status badge with **"Changer le statut"** (select + optional reason/note; reopen requires reason),
  assignee select, `has_dispute` toggle.
- Left: client card (name, email, phone with **`wa.me` link** and `mailto:`, origin, other requests by the same client),
  request facts (service, destination, package, source, source URL, submitted date), the **original message** verbatim,
  and structured `form_answers` rendered as readable key/values.
- Right: **timeline** (`request_events`, newest first): created, status changes (from→to, who, when), notes,
  assignments. **Add note** box (with channel selector: WhatsApp / email / phone / office) → `note` or `contact_attempt` event.
- Editable fields (agent+): client name/email/phone/origin, service type, destination, package, `status_reason`.
  Edits to tracked fields (service/destination/package) write a `field_change` event with old→new in `metadata`.
- Optimistic concurrency: updates send `updated_at`; a stale write shows "modifiée par X entre-temps — recharger".

**New request — `/admin/demandes/nouvelle`** (agent+): for requests arriving by WhatsApp/phone/office:
find-or-create client (email/phone match suggestion), service, destination, package, source (`manual`/`whatsapp`/`referral`),
initial status, note. Duplicate-email guard.

**Clients — `/admin/clients`**: searchable list (name/email/phone) with request count; client detail with all their
requests chronologically. (Merge is Phase 2.)

**Staff — `/admin/equipe`** (admin): list, invite, change role, deactivate (sets `active=false`; does not delete — history
keeps the actor).

**Contenu:** nav item linking to `/cms`; a small explainer page is *not* needed.

### 1C — Live intake

**Public intake — `POST /api/requests`** (`app/api/requests/route.ts`, `runtime = 'nodejs'`)
- Body (zod-validated, max 8 KB): `idempotencyKey`, `firstName`, `lastName`, `email`, `phone?`, `originCountry`,
  `destinationCountry`, `packageSlug`, `serviceType`, `formAnswers` (the store's yes/no answers), `message` (the same
  French sentence used today), `sourceUrl`, honeypot `website` (must be empty).
- Validates `serviceType` and `packageSlug` against the catalogue loaded from `data/**` at build time (`lib/admin/catalogue.ts`),
  normalises country names and phone.
- Calls `submit_service_request(payload)` through the service-role client; returns `{reference}` (shown on the
  "Demande reçue" step so the visitor can quote it).
- Per-IP rate limit (e.g. 10/hour; in-memory is insufficient on serverless → use a small `rate_limits` table or Netlify's
  rate-limiting rule; decide in 1C, default: table + RPC), CORS limited to the site origin, optional Turnstile token check.
- Never throws to the browser: on validation error returns 422 with field errors; on DB error returns 503.

**Form change (dual-write)** — `src/components/AssistanceForm/utils.js` `submitAssistanceRequest`:
1. `POST /api/requests` (new). 2. **Always** also call the legacy `contact-form` endpoint (SES email) so staff still get the
   email and nothing is lost if Supabase is down; if only the legacy call succeeds, the request is flagged
   `not_stored` in Sentry for manual entry. Success to the visitor = at least one succeeded.
- The `information` choice (currently newsletter-only) additionally creates an `information` request with status `new`
  behind `NEXT_PUBLIC_TRACK_INFORMATION_REQUESTS` (default on) — question 5 in the README.
- The structured payload is built where `aboutCandidate`, `assistancePackage`, destination and the yes/no answers already
  live (`store.ts`), not by re-parsing the sentence.

**Price source of truth (300 $):** the owner confirmed Assistance costs **300 $**, which matches
`data/services/assistance.md`, but `src/constants/assistance.js` `AssistancePrices.assistance` is **400** and is what the
form's `store.ts` displays. In this PR the form reads prices from the `services` content it already receives (the store
is initialised with `services`) and `AssistancePrices` is deleted (or, minimally, corrected to 300 with a test that it equals
`data/services/assistance.md`). The same value is what the console later uses as the default agreed price, and what the
analytics event reports. Check the other services' displayed prices against their `.md` files at the same time.

**No import.** The console launches empty. The old workbook is archived read-only outside the repo; open leads still
being worked from it are re-entered by hand via *Nouvelle demande* during the cut-over week (owner decides which).

**Cut-over checklist** (done together with the owner):
1. Staging verified end-to-end with synthetic requests; production starts with zero rows.
2. Team trained in a 30-minute walkthrough; each agent has signed in and enrolled MFA.
3. Two weeks of **soak**: new form submissions are compared with the notification emails daily (expect 1:1).
4. Spreadsheet frozen (read-only), moved out of shared drives and any still-open leads re-entered; "source of truth" statement shared with the team.
5. Privacy-policy update live (what/why/where/retention/deletion contact).

## Acceptance criteria

- [ ] Unauthenticated `GET /admin/**` redirects to login; `anon` Supabase key cannot read any table (pgTAP).
- [ ] A `viewer` can browse but not edit; an `agent` can edit but not delete or manage staff; an inactive user sees nothing.
- [ ] Changing a request's status from the UI creates exactly one `status_change` event with actor and timestamp; there is no
      UI or API path to change status without it.
- [ ] Submitting the real assistance form on a deploy preview creates one client + one request visible in the console within
      seconds, **and** still sends the legacy email; submitting twice with the same idempotency key creates one request.
- [ ] With the Supabase env vars removed, the form still succeeds via the legacy path.
- [ ] List filters (status pills, search, assignee, date range) are reflected in the URL and survive reload; search for a
      known synthetic name/email/phone fragment finds the right request.
- [ ] The assistance form displays 300 $ for Assistance, matching `data/services/assistance.md`; no price constant duplicates the content files.
- [ ] `/cms` works with Netlify Identity login; `/admin` is not indexed (robots + header + sitemap).
- [ ] CI green: lint, build, Vitest, pgTAP.

## Non-goals (Phase 1)

Dashboards/KPIs, kanban board, reminders, message templates, payments, documents, email notifications to staff,
client merge, CSV export (all Phase 2+). No client-facing view of status.

## Risks specific to this phase

- *Form regression* → dual-write + soak + kill switch env var `ADMIN_INTAKE_ENABLED=false` (route returns 204, form falls back to legacy only).
- *Open leads lost in the switch* → cut-over week checklist: owner lists leads still open in the workbook and they are re-entered manually.
- *Auth lockout of the only admin* → create two admin users; document recovery via Supabase dashboard.
