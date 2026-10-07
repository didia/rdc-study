# 02 — Legacy Import (Excel tracker → Supabase)

One-off, idempotent, dry-run-first. Delivered in Phase 1. **Never commit the workbook or any row of it**; the
script reads a path passed on the command line.

## 1. Source facts (measured on the workbook)

- 595 data rows → 555 distinct emails; **no row appears on two tabs** (no cross-tab dedupe needed; dedupe *clients* by email).
- Date range of "Date de demande": 2022-07-05 → 2024-06-01.
- Tabs that hold requests and the status each implies:

| Tab | Rows | Implied status when "Etat actuel" is blank |
|-----|------|--------------------------------------------|
| En cours | 469 | `new` (untouched inbox) |
| Contacté | 9 | `contacted` |
| En attente du client | 7 | `awaiting_client` |
| Relancé | 50 | `follow_up` |
| Discussion | 13 | `in_discussion` |
| Va passer au bureau | 11 | `office_visit` |
| En attente de paiement | 0 | `awaiting_payment` |
| Acompte payé | 3 | `deposit_paid` |
| Echec | 23 | `lost_failed` |
| Sans suite | 10 | `lost_no_response` |

Ignored tabs: `Sheet21`, `Sheet22`, `Stats` (empty), `Journal` (header only), and the lookup tabs `Service`,
`Pays de destination`, `Pays dorigine`, `Etat Actuel` (used only to seed/verify `vocab.ts`).

## 2. Column mapping

Headers differ per tab and several tabs have **shifted columns** (e.g. phone in the country column, package slug in
the country column, the type/strategy/state columns offset by one on "Contacté"). So the importer does **not** trust
column positions blindly:

1. Find the header row; build a `header → index` map per tab (trim, lowercase, strip accents).
2. For each row, classify each cell by *content* rather than position when the header-based value fails validation:
   - looks like an email → `email`; a `datetime` in the first three columns → `submitted_at`;
   - matches `^\+?[\d\s().-]{7,}$` → phone; matches `^[a-z-]+/[a-z-]+$` → `package_slug`;
   - in the origin-country vocabulary (after normalisation) → `origin_country`.
3. Fields:

| Spreadsheet | → Column | Notes |
|-------------|----------|-------|
| nom / Nom du Candidat | `clients.first_name`,`last_name` | split on first space; if one token → last name empty-string-safe (store in `first_name`, `last_name = ''`); fix mojibake (`D�sir�`) → flag for review |
| Email | `clients.email` | lowercase/trim; invalid → null + review flag |
| Téléphone | `clients.phone`, `phone_e164` | parse with `libphonenumber-js`, default region unknown → keep only when it parses with a `+` country code, else leave `phone_e164` null |
| Pays d'origine | `clients.origin_country` | normalise via alias map (`congo-kinshasa`→Congo-Kinshasa, `Guinee`→Guinée, …); unknown → "Autre" + review flag |
| Date de demande | `submitted_at` | Excel datetime, treated as UTC (document the assumption) |
| Type de demande | `service_type` | lowercase; `verification visa`, `verification permis d'etude`, `Vérification du dossier`, `verification et lettre` → `verification` / `verification-et-lettre`; unknown → derived from the message (below) else `assistance` |
| Stratégie de Follow-Up | — | always WhatsApp/Nadia; becomes `preferred_channel='whatsapp'`; "Nadia" is *not* auto-mapped to a staff user (see below) |
| Etat actuel | `status` | explicit value wins over tab; normalised via alias map (below) |
| Raison | `original_message` (and `status_reason` on `Echec`/`Sans suite` only when it is not just the state label) | |
| Litiges | **ignored** | holds copies of the request message; `has_dispute` stays false |
| Assistance Package | `package_slug` | alias `canada/acaq` → `canada/caq` |
| Dernière mise à jour / stray datetimes in cols K–L | `last_activity_at` | take the latest datetime found after the state columns, else `submitted_at` |

### Status alias map (normalised: lowercase, strip accents/punctuation/extra spaces)

| Source text | → status |
|-------------|----------|
| contact initial | `contacted` |
| relance, relancer | `follow_up` (+ `next_follow_up_at = import time` for "relancer": it is a to-do) |
| en discussion avec nadia, en discution avec mm nadia | `in_discussion` |
| en attente du client | `awaiting_client` |
| va passer au bureau | `office_visit` |
| reussi | `deposit_paid` (tab "Acompte payé") |
| echec | `lost_failed` |
| sans suite, sans suite du client | `lost_no_response` |
| *(blank)* | tab default from §1 |

Conflict rule: if an explicit state and the tab disagree, **the explicit state wins** and the row is listed in the report.

## 3. Parsing the generated message (fills missing structure)

Pattern produced by the site form:

```
Je suis {name}, originaire de {origin}. Je veux une {service} pour {thing}. Mon numéro WhatsApp est {phone}..
```

Use it to backfill `service_type`, destination, package and phone when the structured cells are empty/invalid.
`{thing}` → destination/package by rules (case-insensitive, accent-insensitive):

| contains | → destination · package |
|----------|-------------------------|
| `admission` + `Canada` | Canada · `canada/admission` |
| `permis d'études` + `Canada` | Canada · `canada/visa` |
| `certificat d'acceptation du Québec` | Canada · `canada/caq` |
| `admission` + `Chypre` | Chypre du Nord · `chypre/admission` |
| `admission` + `Belgique` | Belgique · `belgique/admission` |
| `équivalence` + `Belgique` | Belgique · `belgique/equivalence` |
| `visa d'études` + `Belgique` | Belgique · `belgique/visa` |
| `admission` + `France` / `visa d'études pour la France` | France · `france/admission` / `france/visa` |
| `admission` + `États-Unis` | États-Unis · `usa/admission` |

Anything that does not match leaves `package_slug` null and is added to the review list. (The slugs follow the
workbook's own values — `canada/admission`, `belgique/equivalence`, … — and must be reconciled with the filenames in
`data/assistance-packages/`, which use `canada-admission.md` style; the importer should consult a single mapping
function shared with the app: `lib/admin/packages.ts`.)

## 4. Staff attribution

The sheet never records *who* acted (only "Whatsapp/Nadia" as a strategy). Import sets `assigned_to = null` and writes the
single `import` event per request: `{type:'import', body:'Imported from Excel tracker (tab: X)'}`. After Phase 1 launches,
an admin can bulk-assign the open legacy requests (a bulk action in the list, Phase 1 "should").

## 5. Script behaviour — `scripts/import-tracker.mjs`

```
node scripts/import-tracker.mjs --file "<path>.xlsx" [--dry-run] [--env staging|prod]
```

- Reads via `exceljs` (devDependency).
- **`--dry-run` (default on)** — parses, normalises, prints counts and writes `import-report.json` / `.csv` to the
  scratchpad/out dir (git-ignored) with: totals per tab/status, rows needing review (reason codes: `bad_email`,
  `unknown_country`, `unparseable_message`, `state_tab_conflict`, `mojibake`, `shifted_columns_repaired`), and clients
  that will be merged.
- **Write mode** — uses the service-role key, upserts `clients` by email (rows without email → one client per row),
  inserts `service_requests` with `legacy_key = sha256(lower(email) || '|' || submitted_at ISO)` using
  `on conflict (legacy_key) do nothing` so re-runs are safe. All inside batched transactions (100 rows).
- **Triggers:** the import disables nothing. The automatic `created` event would be noise, so the script does not insert
  rows through PostgREST; it calls a `security definer` SQL function `import_legacy_requests(rows jsonb)` (service role
  only) that does `set_config('app.import_mode','on', true)` *inside its own transaction*; the trigger honours that
  setting to write an `import` event instead of `created`.
- **Reconciliation (must pass before sign-off):** `COUNT(service_requests where source='legacy_import') = 595`; per-status
  counts equal the report; `COUNT(distinct clients.email)` = 555 (± rows lacking an email); spot-check 20 random rows
  against the workbook with the owner.
- **Rehearsal:** run on staging first, review the report with the owner, fix alias maps, then production.
- **Rollback:** `delete from service_requests where source='legacy_import'` then orphaned clients (script provides
  `--rollback`), possible because nothing else references legacy rows until staff touch them.

## 6. Tests

Vitest unit tests with **synthetic** rows only: message parser (each pattern row above), status alias map (including the
real typos), country alias map, phone normalisation, shifted-column repair, `legacy_key` stability.
