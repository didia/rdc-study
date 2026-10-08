# rdc-study project

This the repository for the rdc-study project.

## Running

```sh
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # TypeScript
npm test           # Vitest (pure logic)
npm run build      # production build (+ sitemap/robots via next-sitemap)
```

The public site works with no environment variables at all. Only the admin console (`/admin`) needs the Supabase
variables below; without them `/admin` shows a "console not configured" login page.

## Admin console

A private console for the team lives at `/admin` (staff requests tracker; see `specs/todo/admin-interface/`).
The content editor (Sveltia CMS) lives at `/cms`.

Backend: Supabase (Postgres + Auth). Schema, RLS policies and tests are in `supabase/`; setup, local development,
environments and the first-admin runbook are in [`supabase/README.md`](supabase/README.md).

## Environment variables

Local values go in `.env.local` (git-ignored); in production they are set in Netlify per context.

```
NEXT_PUBLIC_SITE_URL=Canonical site URL, used by the sitemap (defaults to https://www.rdcetudes.com)
NEXT_PUBLIC_API_ENDPOINT=Base URL of the contact-form API (AWS API Gateway → Lambda → SES)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=Google Analytics 4 measurement id (production)
NEXT_PUBLIC_SENTRY_DSN_URL=Sentry DSN (production)
SENTRY_ORG / SENTRY_PROJECT=Sentry build-time configuration (source maps)

# Admin console (all optional for the public site)
NEXT_PUBLIC_SUPABASE_URL=Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon / publishable key (safe for the browser; RLS protects the data)
SUPABASE_SERVICE_ROLE_KEY=Supabase service-role / secret key — SERVER ONLY, never expose; used for staff invitations and public intake
ADMIN_ALLOWED_EMAIL_DOMAINS=Optional comma-separated list of email domains allowed for staff invitations
ADMIN_INTAKE_ENABLED=Set to false to stop storing assistance requests (kill switch: the form keeps sending the legacy email)
INTAKE_RATE_LIMIT=Max stored requests per IP per hour (default 10)
TURNSTILE_SECRET_KEY=Optional Cloudflare Turnstile secret; when set the intake route requires a valid token
NEXT_PUBLIC_TRACK_INFORMATION_REQUESTS=Set to false to stop logging "information" choices as requests (default on)
```

Producing the first admin: `node --env-file=.env.local scripts/create-admin.mjs --email … --name "…"` (see `supabase/README.md`).

### Feature flags

Sections that are built but waiting for real content are hidden by default. Set the variable to `true` to show them:

```
NEXT_PUBLIC_FEATURE_TESTIMONIALS=true     # Testimonials + "what AI assistants say" (home, services). Content: `site.testimonials.*` in src/locales/fr.json
NEXT_PUBLIC_FEATURE_FEATURED_GUIDE=true   # Featured step-by-step guide on /guides. Content: `site.guides.featured.*` in src/locales/fr.json
```

To show a photo for testimonial N, add `"site.testimonials.items.N.photo": "/images/uploads/<file>.jpg"` to fr.json.
