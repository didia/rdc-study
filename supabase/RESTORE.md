# Backups and restore drill

What protects the data, in order of preference:

| Layer | Covers | Retention | Use it for |
|-------|--------|-----------|-----------|
| Supabase **Pro daily backups** (and PITR if enabled) | database | per plan | "someone deleted something yesterday", an incident |
| **Weekly logical dump** (`.github/workflows/backup.yml`) | `public` + `auth` schemas **and** the `request-docs` bucket, encrypted | keep ≥ 12 weeks (bucket lifecycle rule) | losing the project, migrating, a provider problem |

Supabase backups do **not** include Storage objects (documents): the weekly job is the only copy of those.

## Setting the weekly job up (once)

1. Create a private S3-compatible bucket (versioning on, lifecycle ≥ 90 days). Create a write-only access key for it.
2. Generate a GPG key pair **on the owner's machine**; keep the private key offline (password manager + paper copy).
   Export the public key: `gpg --armor --export owner@example.com`.
3. GitHub → Settings → Secrets and variables → Actions:
   secrets `BACKUP_DB_URL` (direct connection string, *session* pooler or db host), `BACKUP_SUPABASE_URL`,
   `BACKUP_SUPABASE_SERVICE_ROLE_KEY`, `BACKUP_GPG_PUBLIC_KEY`, `BACKUP_GPG_RECIPIENT`, `BACKUP_S3_BUCKET`,
   `BACKUP_S3_ACCESS_KEY_ID`, `BACKUP_S3_SECRET_ACCESS_KEY`, `BACKUP_S3_REGION`, optional `BACKUP_S3_ENDPOINT`;
   variable `BACKUP_ENABLED=true`.
4. Run the workflow once by hand and check the object appears and decrypts. The job installs `pg_dump` 17 and fails when
   the version differs or when fewer documents were copied than `storage.objects` lists.

## Restore drill (do it before go-live, then every 6 months)

Goal: complete in **≤ 1 hour** and verify the data. Write the timings in the table at the bottom.

Prerequisites: `psql` and `pg_restore` **17** (same as the backup job), `STAGING_DB_URL` = the target's direct connection string.
Run every database command with `PGOPTIONS='-c session_replication_role=replica'`: on hosted Supabase the `postgres` role
cannot `DISABLE TRIGGER ALL` (so `pg_restore --disable-triggers` fails with `permission denied`), but it can set this
role, which stops triggers and foreign-key checks for the session. Without it `payments_guard` would clear `voided_at` on
every restored payment (voided money counted as revenue again) and `log_request_changes` would add a `created` event per request.

1. Create a throw-away Supabase project (or reuse `rdcetudes-staging`) and apply the schema:
   `supabase link --project-ref <staging> && supabase db push`. The migrations insert the seed rows (prices, settings,
   statuses, templates), so step 3 empties `public` before loading the dump.
2. Download and decrypt the latest backup:
   ```sh
   aws s3 cp s3://<bucket>/weekly/rdcetudes-YYYY-MM-DD.tar.gz.gpg .
   gpg --decrypt rdcetudes-YYYY-MM-DD.tar.gz.gpg | tar -xz
   ```
3. Staff accounts first (`staff_profiles.id` references `auth.users`). Into an **empty project of the same Supabase
   version**, restore the users:
   ```sh
   export PGOPTIONS='-c session_replication_role=replica'
   pg_restore --data-only --exit-on-error --single-transaction -t auth.users -t auth.identities -d "$STAGING_DB_URL" db.dump
   ```
   If the project is not empty or the version differs, skip this and use the re-invite path in step 5 instead.
4. Load the **data** of `public`, replacing the seed rows (the load is one transaction and stops at the first error —
   the exit code must be 0, otherwise nothing was loaded):
   ```sh
   export PGOPTIONS='-c session_replication_role=replica'
   psql "$STAGING_DB_URL" -v ON_ERROR_STOP=1 -c "do \$\$ declare t text; begin
     for t in select tablename from pg_tables where schemaname = 'public' loop
       execute format('truncate table public.%I cascade', t);
     end loop; end \$\$"
   pg_restore --data-only --exit-on-error --single-transaction --schema=public -d "$STAGING_DB_URL" db.dump
   ```
5. Re-invite path (no `auth` restore): `staff_profiles` rows still hold the old ids, which no longer exist in
   `auth.users`. Re-invite each person from `/admin/equipe` (this creates a new profile with a new id), then point the
   history at it. In `psql`, with `PGOPTIONS` set as above and `old`/`new` the two ids, then delete the old profile:
   ```sql
   \set old '00000000-0000-0000-0000-000000000000'
   \set new '11111111-1111-1111-1111-111111111111'
   begin;
   select format('update %s set %I = %L where %I = %L', conrelid::regclass, a.attname, :'new', a.attname, :'old')
     from pg_constraint c join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
    where c.contype = 'f' and c.confrelid = 'public.staff_profiles'::regclass \gexec
   delete from public.staff_profiles where id = :'old';
   commit;
   ```
   (The query covers every column that references `staff_profiles`: `assigned_to`, `mentor_id`, `request_events.actor_id`,
   payment and document staff columns, etc., so a new column is picked up automatically.)
6. Documents: upload `documents/` back into the `request-docs` bucket keeping the same paths
   (`supabase storage cp -r documents/ ss:///request-docs --experimental` or the Storage API).
7. Verify. Row counts alone do not prove the seeded tables came back, so compare checksums on the source and the restore:
   ```sql
   select 'clients', count(*) from public.clients
   union all select 'service_requests', count(*) from public.service_requests
   union all select 'request_events', count(*) from public.request_events
   union all select 'payments', count(*) from public.payments
   union all select 'voided payments', count(*) from public.payments where voided_at is not null
   union all select 'request_documents', count(*) from public.request_documents
   union all select 'service_prices', md5(string_agg(t::text, '|' order by t.service_type, t.scope)) from public.service_prices t
   union all select 'app_settings', md5(string_agg(t::text, '|' order by t.key)) from public.app_settings t;
   ```
   Every line must be identical on both sides. Then open three requests, check the timeline, a payment total (voided
   payments excluded) and download a document.

### Drill log

| Date | Who | Backup used | Total time | Notes |
|------|-----|-------------|-----------|-------|
|      |     |             |           |       |

## Disaster checklist (production lost)

1. New Supabase project (same region), run the migrations, restore as above.
2. Update the Netlify variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
   and redeploy. The public form keeps working through the legacy email path in the meantime
   (`ADMIN_INTAKE_ENABLED=false` makes that explicit).
3. Set the Auth URL configuration and email templates again (see `supabase/README.md`).
