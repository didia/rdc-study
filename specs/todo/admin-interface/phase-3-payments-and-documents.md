# Phase 3 — Payments, Documents & Delivery

**Goal:** close the loop after "Acompte payé". Today the old tracker ended at the deposit; money received (Mobile Money,
cash at the office), signed contracts, receipts and the actual mentoring work are tracked nowhere.

**Usable result:** an agent records a 100 $ Mobile Money deposit against a request, uploads the signed contract, the status
advances to *Acompte payé*; a mentor sees only their assigned clients and moves the engagement to *Terminé*; the owner
sees revenue and outstanding balances.

Depends on Phases 1–2 in production. Adds tables `payments`, `request_documents`, columns
`agreed_price_cents`, `agreed_currency`, `mentor_id` ([01 §3](./01-data-model.md)), the private storage bucket
`request-docs`, and the `mentor` role in policies.

## Scope

### 3.1 Agreed price
- On a request at/after `awaiting_payment`: set **agreed price**, defaulting from `data/services/<service>.md` `price`
  (**Assistance = 300 $**, owner-confirmed; the same file feeds the public form after the Phase 1 fix), overridable by
  agent+ for discounts (override requires a reason, logged). Shown with **paid / balance** on the detail page and as list columns.
- **Deposit rule:** configurable share (default **50 %**, i.e. 150 $ of 300 $, in line with the old "two equal tranches"
  process) in `/admin/parametres`; to be confirmed with the owner.

### 3.2 Payments ledger
- "Enregistrer un paiement" (agent+): kind (acompte / solde / total / remboursement), amount, currency (USD default; CDF/EUR
  allowed), method (Mobile Money / espèces au bureau / virement / autre), external reference (Mobile Money transaction ID or
  receipt no.), date received, note.
- **Immutable money records:** no delete or edit of amounts; a mistaken entry is **voided** (admin), with reason, keeping the
  original row. Voids and creations write `payment` events.
- **Auto status suggestions:** when paid ≥ deposit threshold the UI proposes `deposit_paid`; when paid ≥ agreed price,
  `paid`. Suggestions are one-click, never silent (staff confirm the money actually arrived).
- Payments list `/admin/paiements` with filters (date, method, kind, agent) and totals.

### 3.3 Documents (private storage)
- Upload to the `request-docs` bucket from the detail page: **contract**, **receipt**, **client document**,
  **deliverable**, other. 10 MB limit, allow-list of MIME types (PDF, images, Office docs), virus-scan note: files are only
  served via short-lived signed URLs with `Content-Disposition: attachment`.
- Storage policies mirror table policies; path convention `request/<request_id>/<uuid>-<filename>`.
- Documents appear in the timeline (`document` events).

### 3.4 Contract & receipt generation
- Fill-in templates generate a PDF **service contract** from request + client data (name, address, package, price,
  tranche schedule, payment instructions) — the form doc says a contract is issued after the first tranche. Template text
  edited by admin in `/admin/modeles` (versioned; the generated PDF is stored as a `contract` document, so later template
  edits never rewrite history). Same for a **receipt** per payment.
- PDF generation server-side (small lib such as `pdf-lib` or `@react-pdf/renderer`) in a route handler.
- Needs the client's postal address: add optional `clients.address` (step 4 of `documentation/ASSISTANCE-FORM.md` collects it).

### 3.5 Delivery tracking (after payment)
- Activate statuses `in_progress`, `completed` (set `is_active=true`) and `paid`.
- **Mentor assignment** (`mentor_id`) distinct from the sales owner (`assigned_to`); `mentor` role sees only their
  requests/clients/documents (policies in [01 §6](./01-data-model.md); pgTAP-tested).
- Simple **checklist per package** derived from the package's `services` list in `data/assistance-packages/*.md`
  (e.g. "Choisir un programme", "Préparer la demande"): items ticked by the mentor, each tick logged. Stored as
  `form_answers`-style jsonb `delivery_checklist` on the request (no extra table until proven necessary).

### 3.6 Revenue reporting
- Dashboard additions: **encaissements** by month/method/destination/package, **solde à encaisser**, average time from
  `deposit_paid` to `completed`, refund rate. All computed from non-voided payments.
- Month-end CSV export of payments (audit-logged, admin only).

## Acceptance criteria

- [ ] A payment cannot be deleted or have its amount edited via UI or API (RLS + no policy); void keeps both rows and an event.
- [ ] Paid/balance computation ignores voided payments and handles multiple currencies by never summing across currencies.
- [ ] A `mentor` cannot see unassigned requests, other staff's notes on them, or payments (pgTAP).
- [ ] Uploaded documents are unreachable without a valid signed URL; a viewer without access to the request cannot mint one.
- [ ] Generated contract PDF for a synthetic request contains the correct client/package/price and is stored as a document.
- [ ] Revenue totals equal a hand-computed fixture.

## Non-goals

Online card/Mobile Money API collection; accounting-system integration; client-facing invoices portal; multi-currency conversion.

## Risks

- *Financial data errors* → immutability + voids + suggestions-not-automation.
- *Sensitive documents (passports, diplomas)* → private bucket, signed URLs, retention rules in Phase 4, minimal mentor access.
