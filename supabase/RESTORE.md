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
4. Run the workflow once by hand and check the object appears and decrypts.

## Restore drill (do it before go-live, then every 6 months)

Goal: complete in **≤ 1 hour** and verify the data. Write the timings in the table at the bottom.

1. Create a throw-away Supabase project (or reuse `rdcetudes-staging`) and apply the schema:
   `supabase link --project-ref <staging> && supabase db push`.
2. Download and decrypt the latest backup:
   ```sh
   aws s3 cp s3://<bucket>/weekly/rdcetudes-YYYY-MM-DD.tar.gz.gpg .
   gpg --decrypt rdcetudes-YYYY-MM-DD.tar.gz.gpg | tar -xz
   ```
3. Restore the **data** of `public` (the schema already exists from step 1):
   ```sh
   pg_restore --data-only --disable-triggers --schema=public -d "$STAGING_DB_URL" db.dump
   ```
   `--disable-triggers` keeps the restore from re-writing history events and `updated_at`.
4. Staff accounts: restore the `auth` schema data too **only** when restoring into an empty project of the same
   Supabase version; otherwise re-invite the team from `/admin/equipe` after restoring `staff_profiles`
   (their ids will change: update `staff_profiles.id` accordingly or recreate the profiles).
5. Documents: upload `documents/` back into the `request-docs` bucket keeping the same paths
   (`supabase storage cp -r documents/ ss:///request-docs --experimental` or the Storage API).
6. Verify: row counts of `clients`, `service_requests`, `request_events`, `payments`, `request_documents` match the
   source; open three requests, check the timeline, a payment total and download a document.

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
