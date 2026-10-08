# Phase 2 — Daily Operations

**Goal:** turn the tracker into a working tool: tell each person *what to do today*, show *where leads are lost*, and
cut the clerical work around WhatsApp follow-up.

**Usable result:** an agent opens the console and sees "À relancer aujourd'hui (7)"; the owner opens the dashboard and
sees the conversion funnel by destination and origin country; contacting a lead takes two clicks.

Depends on Phase 1 in production. No change to intake.

## Scope

### 2.1 "Aujourd'hui" home — `/admin`
- Cards: **À relancer** (open requests with `next_follow_up_at <= now`, mine first), **Nouvelles non assignées**,
  **En attente depuis > N jours** (per-status thresholds, configurable constants), **Mes demandes ouvertes**.
- Each row shows the one-line context and an inline **Fait / Reporter** (+1 j, +3 j, +7 j, custom) that writes a
  `contact_attempt` event and moves `next_follow_up_at`.

### 2.2 Follow-up scheduling
- `next_follow_up_at` becomes editable in the detail page and in the status-change dialog ("rappeler dans…").
- **Default cadence suggestions** (constants, tweakable): after `contacted` → +2 d; `follow_up` → +3 d; `awaiting_client` → +5 d;
  `awaiting_payment` → +3 d. After the Nth unanswered relance (default 3) the UI suggests `lost_no_response`.
- Overdue counter in the sidebar badge. (Email/push digest is Phase 4.)

### 2.3 Dashboard — `/admin/tableau-de-bord`
Answers the question the spreadsheet was named for — conversions.
- **Funnel** for a date range (submitted date): Nouvelles → contactées → en discussion → en attente de paiement → acompte
  payé (won). Counts and step conversion %.
- **Breakdowns** of volume and conversion rate by: destination country, package, origin country, service type, source,
  assignee.
- **Speed:** median time to first contact (`created` → first `status_change` out of `new`), median time to won.
- **Loss analysis:** counts by `lost_reason` (new lookup, see below) and by last status before loss.
- **Trend:** requests per week/month.
- Implemented as SQL views / RPC (`v_funnel`, `fn_conversion_by(dimension, from, to)`) so numbers are testable; charts with
  a tiny dependency (e.g. `recharts`) or plain SVG; follow the `dataviz` conventions for colour/accessibility.

### 2.4 Board view — `/admin/demandes?vue=tableau`
- Kanban with columns = statuses (same order as the old tabs); drag a card to change status (confirmation dialog for moves
  into `lost_*` asks for `lost_reason`). Uses `@dnd-kit`; keyboard-accessible alternative = the existing status select.
- Filters shared with the list. Column counts + oldest-card age.

### 2.5 Lost reasons
- `lost_reasons` lookup seeded (admin-editable): `no_response`, `too_expensive`, `chose_competitor`, `not_eligible`,
  `changed_plans`, `visa_refused_elsewhere`, `duplicate`, `other`. Required when entering `lost_failed` / `lost_no_response`


### 2.6 WhatsApp & email templates
- `message_templates` managed by admin (`/admin/modeles`): first contact, reminder, payment instructions (Mobile Money
  number / office address pulled from `config.js` `contact`), "documents needed", "closing".
- On a request: **"Contacter sur WhatsApp"** menu → choose template → placeholders rendered
  (`{{first_name}}`, `{{package}}`, `{{staff_name}}`, `{{reference}}`) → opens `https://wa.me/<phone_e164>?text=…`; an
  optional "Marquer comme contacté + note" logs a `contact_attempt` event with `channel='whatsapp'`. Email variant opens `mailto:`.
- Clients without a parseable phone get an inline "Ajouter un numéro international" prompt.

### 2.7 Saved views & export
- `saved_views` (per user, optionally shared): e.g. "Mes relances", "Canada – en attente du client".
- **CSV export** of the current filtered list (agent+), with an `exports` audit event (who exported what filter, when) because it
  moves personal data out of the system.

### 2.8 Client merge & duplicate detection
- On client create/intake: suggest existing client by email/phone/trigram name. `/admin/clients/doublons` lists likely
  duplicates (same `phone_e164`, near-identical names); `merge_clients()` ([01 §5](./01-data-model.md)) with a confirmation
  that previews what moves.

### 2.9 Workload
- Assignment filter counts, "Assigner automatiquement" round-robin option for new web requests (off by default; setting
  in `/admin/parametres`).

## Acceptance criteria

- [ ] An overdue request appears on "À relancer" for its owner and disappears after "Fait" with a logged event.
- [ ] Funnel/breakdown numbers equal manual SQL counts on staging data (test in `supabase/tests`).
- [ ] Moving a card on the board writes the same history as the status dialog; moving into lost requires a reason.
- [ ] WhatsApp template link opens `wa.me` with the correctly rendered, URL-encoded text for a synthetic client.
- [ ] CSV export honours filters and records an audit event; `viewer` cannot export.
- [ ] Merging two clients moves all requests, leaves a timeline entry, and cannot be done by `agent` without confirmation step.

## Non-goals

Automatic sending via the WhatsApp Business API; email campaign tooling; payments (Phase 3); push/email reminders (Phase 4).

## Risks

- *Small numbers:* the console starts empty, so early percentages are noisy → show absolute counts next to every rate and hide rates below a minimum sample (e.g. 10).
- *Template misuse (wrong person):* always show the rendered message and recipient before opening WhatsApp.
