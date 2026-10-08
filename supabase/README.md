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
