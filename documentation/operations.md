# Operating the admin console

## Monitoring

| What | How |
|------|-----|
| Intake errors | Sentry alert on events tagged `area:intake` (the intake route reports storage failures there) |
| Legacy fallback usage | Sentry alert on the message `assistance_request_not_stored` (the visitor was served by the email path only — enter the request by hand) |
| Notification failures | Sentry tag `area:notifications` |
| Retention | `retention_dry_run` / `retention_run` rows in `/admin/audit` |
| Uptime | HTTP check on `https://www.rdcetudes.com/api/requests/health` (expects `{"ok":true}`, touches no data) |
| Plan limits | Supabase → Organization → Usage: email alert at **70 %** of database size, egress and storage |

## Secrets and keys

- `SUPABASE_SERVICE_ROLE_KEY` lives only in Netlify (server-side) and in the GitHub secrets used by the backup job.
  **Rotate it** (Supabase → Settings → API) when someone with access leaves, then update Netlify and GitHub and redeploy.
- `CRON_SECRET` protects the scheduled endpoints (`/api/cron/digest`, `/api/cron/retention`); rotate it the same way.
- GitHub secret scanning and push protection: enable them in the repository settings (Dependabot is already configured).
- Never paste real client data into issues, PRs, Sentry events or test fixtures — fixtures use synthetic people only.

## Roll-out switches

| Switch | Where | Default |
|--------|-------|---------|
| Store website requests | `ADMIN_INTAKE_ENABLED` (Netlify) | on; `false` = legacy email only |
| Second factor mandatory | `/admin/parametres` → Sécurité | off until every admin/agent has enrolled |
| Round-robin assignment | `/admin/parametres` | off |
| Automatic retention | `/admin/confidentialite` | off (dry run only) |
| Emails and digest | `RESEND_API_KEY`, `NOTIFY_FROM`, `CRON_SECRET` | not configured = no email |

## Cleaning up once the console is trusted

After a few stable weeks: remove the legacy `contact-form` call from `src/components/AssistanceForm/utils.js` (and the
AWS Lambda in `aws/`), and the `NEXT_PUBLIC_TRACK_INFORMATION_REQUESTS` flag. Do it in its own PR.
