# Supabase (admin console backend)

Postgres + Auth for the private admin console (`/admin`). Design: `specs/todo/admin-interface/`.

```
supabase/
  config.toml        local stack + auth settings (mirror these in the hosted projects, see below)
  migrations/        the schema — the ONLY way production changes (never edit prod in the dashboard)
  templates/         French auth emails (invitation, password reset)
  tests/             pgTAP tests: RLS, triggers, price resolution (`npm run db:test`)
```

## Local development

Needs Docker and the Supabase CLI.

```sh
supabase start        # ports 563xx (offset so it can run next to other Supabase projects)
supabase status       # shows the URL + keys → copy into .env.local
supabase db reset     # re-applies migrations (+ seed) from scratch
npm run db:test       # pgTAP
npm run db:lint
```

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:56321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Publishable key from `supabase status`>
SUPABASE_SERVICE_ROLE_KEY=<Secret key from `supabase status`>
```

Create a local admin (password sign-in) and open <http://localhost:3000/admin>:

```sh
node --env-file=.env.local scripts/create-admin.mjs --email you@example.com --name "Your Name" --password '<12+ characters>'
```

Auth emails (invitations, resets) are caught by the local mail UI at <http://127.0.0.1:56324>.

## Hosted projects

| Env | Project | Plan |
|-----|---------|------|
| Staging / deploy previews | `rdcetudes-staging` | Free is fine (it pauses when idle) |
| Production | `rdcetudes-prod` | **Pro** (no pausing, daily backups) |

For each project, in the Supabase dashboard (these cannot be expressed in migrations):

1. **Authentication → Sign In / Providers:** keep *Email* enabled, **disable "Allow new users to sign up"** (accounts only exist through invitations).
2. **Authentication → URL Configuration:** Site URL = the site origin (`https://www.rdcetudes.com`, or the staging URL);
   add `<origin>/admin/auth/callback` to the redirect allow-list.
3. **Authentication → Email Templates:** paste `templates/invite.html` and `templates/recovery.html`
   (French; they link to `/admin/auth/callback?token_hash=…`).
4. **Authentication → Multi-Factor:** enable TOTP.
5. **Authentication → Password:** minimum length 12.
6. Region: pick the closest to the staff and note it in the privacy policy.
7. Link and push the schema: `supabase link --project-ref <ref> && supabase db push`
   (CI does this on merge once `SUPABASE_DEPLOY_ENABLED=true`, see `.github/workflows/supabase-deploy.yml`).

Netlify environment variables per context: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (server-only; never prefix with `NEXT_PUBLIC_`).

## First admin on a hosted project

```sh
NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… NEXT_PUBLIC_SITE_URL=https://www.rdcetudes.com \
  node scripts/create-admin.mjs --email owner@example.com --name "Owner Name"
```

Without `--password` an invitation email is sent. Create **two** admins so nobody gets locked out. Everyone else is
invited from `/admin/equipe`. Lost-phone recovery: remove the user's factor in the dashboard
(Authentication → Users → the user → Factors).

## Writing migrations

- One file per change in `migrations/`, timestamp-prefixed. Never edit a migration that has been merged.
- Every new table: `enable row level security`, explicit policies, and **`revoke all … from anon`** (Supabase grants
  `anon` access to new tables by default; a pgTAP test fails if you forget).
- New `security definer` functions: `set search_path = ''`, and revoke `execute` from `public`/`anon`.
- Add a pgTAP test next to the change.

## Going live with intake (cut-over checklist)

The public assistance form posts to `/api/requests` **and** still sends the legacy email, so nothing is lost if
Supabase is down. `ADMIN_INTAKE_ENABLED=false` (or missing Supabase variables) turns storage off without touching the form.

1. Staging verified end-to-end with synthetic requests; production starts with zero rows.
2. Team trained (30 min); every agent has signed in and enrolled TOTP.
3. Two weeks of soak: compare new requests with the notification emails daily (expect 1:1). A request that reached the
   email but not the console is reported to Sentry as `assistance_request_not_stored` — enter it by hand with *Nouvelle demande*.
4. Freeze the old spreadsheet, re-enter still-open leads by hand, announce the console as the source of truth.
5. Privacy-policy section reviewed by the owner (retention, hosting region) and live.

Prices are edited at `/admin/tarifs` (admins). The site reads them from the database (cached, invalidated on save);
`lib/default-prices.ts` is only an outage fallback and must be kept in sync with the seed.
