begin;
create extension if not exists pgtap with schema extensions;
select plan(39);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e1@test.local'),
  ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e2@test.local'),
  ('00000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e3@test.local'),
  ('00000000-0000-0000-0000-0000000000e4', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e4@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000e1', 'Admin E', 'admin'),
  ('00000000-0000-0000-0000-0000000000e2', 'Agent E', 'agent'),
  ('00000000-0000-0000-0000-0000000000e3', 'Viewer E', 'viewer'),
  ('00000000-0000-0000-0000-0000000000e4', 'Mentor E', 'mentor');
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-0000000000e4');
delete from public.payments;
delete from public.service_requests;

insert into public.clients (id, first_name, last_name, email) values ('10000000-0000-0000-0000-0000000000e1', 'Pay', 'Er', 'pay@test.local');
insert into public.service_requests (id, client_id, service_type, destination_country, package_slug, source, status, quoted_price_cents)
  values ('20000000-0000-0000-0000-0000000000e1', '10000000-0000-0000-0000-0000000000e1', 'assistance', 'Canada', 'canada/visa', 'manual', 'awaiting_payment', 60000),
         ('20000000-0000-0000-0000-0000000000e2', '10000000-0000-0000-0000-0000000000e1', 'assistance', 'Canada', 'canada/visa', 'manual', 'new', 50000);
-- A won-stage status added by an admin later on must count as money still to collect.
-- r4 has a deposit that a refund already relies on (dated outside the revenue windows below).
insert into public.service_requests (id, client_id, service_type, destination_country, package_slug, source, status, quoted_price_cents)
  values ('20000000-0000-0000-0000-0000000000e4', '10000000-0000-0000-0000-0000000000e1', 'assistance', 'Canada', 'canada/visa', 'manual', 'new', 1000);
insert into public.payments (request_id, kind, amount_cents, method, paid_at, recorded_by) values
  ('20000000-0000-0000-0000-0000000000e4', 'deposit', 1000, 'other', '2025-01-01', '00000000-0000-0000-0000-0000000000e2'),
  ('20000000-0000-0000-0000-0000000000e4', 'refund', 800, 'other', '2025-01-02', '00000000-0000-0000-0000-0000000000e2');
insert into public.request_statuses (code, label_fr, stage, sort_order, color, is_active) values ('won_extra', 'Gagné (test)', 'won', 85, '#000000', true);
insert into public.service_requests (id, client_id, service_type, destination_country, package_slug, source, status, quoted_price_cents)
  values ('20000000-0000-0000-0000-0000000000e3', '10000000-0000-0000-0000-0000000000e1', 'assistance', 'Canada', 'canada/visa', 'manual', 'won_extra', 10000);

create function pg_temp.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end;
$$;
create function pg_temp.affected(stmt text) returns int language plpgsql as $$
declare n int;
begin execute stmt; get diagnostics n = row_count; return n; end;
$$;

-- delivery statuses are visible
select is((select count(*)::int from public.request_statuses where code in ('paid','in_progress','completed') and is_active), 3, 'delivery statuses are active');

-- Agent records payments ---------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000e2');
select lives_ok($$insert into public.payments (request_id, kind, amount_cents, currency, method, paid_at, recorded_by, external_ref)
  values ('20000000-0000-0000-0000-0000000000e1', 'deposit', 30000, 'USD', 'mobile_money', '2026-03-05', '00000000-0000-0000-0000-0000000000e2', 'MM123')$$,
  'an agent can record a deposit');
select throws_ok($$insert into public.payments (request_id, kind, amount_cents, method, paid_at, recorded_by)
  values ('20000000-0000-0000-0000-0000000000e1', 'deposit', 100, 'other', now(), '00000000-0000-0000-0000-0000000000e1')$$,
  '42501', null, 'a payment cannot be recorded in someone else''s name');
select throws_ok($$insert into public.payments (request_id, kind, amount_cents, method, paid_at, recorded_by)
  values ('20000000-0000-0000-0000-0000000000e1', 'deposit', 0, 'other', now(), '00000000-0000-0000-0000-0000000000e2')$$,
  '23514', null, 'amounts must be positive');
insert into public.payments (request_id, kind, amount_cents, currency, method, paid_at, recorded_by)
  values ('20000000-0000-0000-0000-0000000000e1', 'balance', 10000, 'CDF', 'cash_office', '2026-03-20', '00000000-0000-0000-0000-0000000000e2'),
         ('20000000-0000-0000-0000-0000000000e1', 'balance', 5000, 'USD', 'cash_office', '2026-04-02', '00000000-0000-0000-0000-0000000000e2'),
         ('20000000-0000-0000-0000-0000000000e1', 'refund', 2000, 'USD', 'bank_transfer', '2026-04-10', '00000000-0000-0000-0000-0000000000e2');
select throws_ok($$insert into public.payments (request_id, kind, amount_cents, method, paid_at, recorded_by)
  values ('20000000-0000-0000-0000-0000000000e1', 'refund', 999999, 'bank_transfer', now(), '00000000-0000-0000-0000-0000000000e2')$$,
  'P0001', null, 'a refund cannot exceed what was received');
select throws_ok($$insert into public.payments (request_id, kind, amount_cents, currency, method, paid_at, recorded_by)
  values ('20000000-0000-0000-0000-0000000000e1', 'refund', 100, 'EUR', 'bank_transfer', now(), '00000000-0000-0000-0000-0000000000e2')$$,
  'P0001', null, 'nor refund in a currency nothing was received in');
select throws_ok($$insert into public.payments (request_id, kind, amount_cents, currency, method, paid_at, recorded_by, external_ref)
  values ('20000000-0000-0000-0000-0000000000e1', 'deposit', 30000, 'USD', 'mobile_money', now(), '00000000-0000-0000-0000-0000000000e2', 'MM123')$$,
  '23505', null, 'the same transaction reference cannot be recorded twice');

-- Agreed price: reason, currency rules and audit hold on every write path ---------------------------
select throws_ok($$update public.service_requests set agreed_price_cents = 1 where id = '20000000-0000-0000-0000-0000000000e1'$$,
  'P0001', null, 'a direct price override without a reason is refused');
select throws_ok($$select public.set_agreed_price('20000000-0000-0000-0000-0000000000e1', 60000, 'CDF', 'le client paie en francs')$$,
  'P0001', null, 'the currency cannot change while payments exist in the old one');
select throws_ok($$select public.set_agreed_price('20000000-0000-0000-0000-0000000000e2', null, 'EUR', 'euros')$$,
  'P0001', null, 'a non-USD price needs an explicit amount');
select throws_ok($$select public.set_agreed_price('20000000-0000-0000-0000-0000000000e2', 100, 'usd', 'minuscules')$$,
  '23514', null, 'agreed_currency is one of USD, CDF, EUR');
select lives_ok($$select public.set_agreed_price('20000000-0000-0000-0000-0000000000e2', 35000, 'USD', 'remise fidélité')$$,
  'an override with a reason goes through');
select is((select body || ' ' || (metadata->>'from') || '>' || (metadata->>'to') || ' ' || (metadata->>'to_currency') from public.request_events
            where request_id = '20000000-0000-0000-0000-0000000000e2' and type = 'field_change' and metadata->>'field' = 'agreed_price'),
  'remise fidélité 50000>35000 USD', 'the override is on the timeline with its reason and currency');
select lives_ok($$select public.set_agreed_price('20000000-0000-0000-0000-0000000000e2', null, 'USD', '')$$,
  'going back to the quoted price needs no reason');
select is(pg_temp.affected('update public.payments set amount_cents = 1'), 0, 'an agent cannot edit a payment');
select throws_ok($$delete from public.payments$$, '42501', null, 'an agent cannot delete payments');
select is((select count(*)::int from public.request_events where request_id = '20000000-0000-0000-0000-0000000000e1' and type = 'payment'), 4,
  'each payment is on the timeline');
reset role;

-- Viewers see no money -----------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000e3');
select is((select count(*)::int from public.payments), 0, 'a viewer cannot see payments');
select is((select count(*)::int from public.request_paid), 0, 'nor the paid totals');
select is((select count(*)::int from public.request_events where type = 'payment'
            or (type = 'field_change' and metadata->>'field' = 'agreed_price')), 0, 'nor the money copied into the timeline');
select cmp_ok((select count(*)::int from public.request_events where type = 'created'), '>', 0, 'the rest of the timeline stays readable');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000e4');
select is((select count(*)::int from public.payments) + (select count(*)::int from public.request_paid), 0, 'a mentor reads no payments either');
reset role;

-- Admin voids -----------------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000e1');
select throws_ok($$update public.payments set amount_cents = 1 where kind = 'refund'$$, 'P0001', null, 'even an admin cannot change an amount');
select throws_ok($$update public.payments set voided_at = now() where kind = 'refund'$$, 'P0001', null, 'a void needs a reason');
select throws_ok($$delete from public.payments$$, '42501', null, 'nobody can delete payments (no privilege)');
select throws_ok($$update public.payments set voided_at = now(), void_reason = 'Erreur' where kind = 'deposit' and request_id = '20000000-0000-0000-0000-0000000000e4'$$, 'P0001', null,
  'a payment a refund relies on cannot be voided before the refund');
select lives_ok($$update public.payments set voided_at = '2000-01-01', void_reason = 'Saisie en double' where kind = 'balance' and currency = 'CDF'$$, 'an admin can void a payment');
select is((select voided_at = now() from public.payments where kind = 'balance' and currency = 'CDF'), true, 'the void time is the server''s, not the caller''s');
select throws_ok($$update public.payments set void_reason = 'again' where kind = 'balance' and currency = 'CDF'$$, 'P0001', null, 'a void cannot be rewritten');
select is((select count(*)::int from public.payments where request_id = '20000000-0000-0000-0000-0000000000e1'), 4, 'the voided row is kept');
select is((select count(*)::int from public.request_events where request_id = '20000000-0000-0000-0000-0000000000e1' and type = 'payment'
            and metadata->>'action' = 'voided'), 1, 'the void is on the timeline');
reset role;

-- Totals never mix currencies and ignore voided rows ---------------------------------------------
select results_eq(
  $$select currency, net_cents::int from public.request_paid where request_id = '20000000-0000-0000-0000-0000000000e1' order by currency$$,
  $$values ('USD'::text, 33000)$$,
  'net USD = 300 + 50 - 20; the voided CDF payment is ignored');
select results_eq(
  $$select label, currency, net_cents::int from public.fn_revenue_by('method', '2026-03-01', '2026-05-01') order by label$$,
  $$values ('bank_transfer'::text, 'USD'::text, -2000), ('cash_office', 'USD', 5000), ('mobile_money', 'USD', 30000)$$,
  'revenue by method equals the hand computation');
select results_eq(
  $$select label, net_cents::int from public.fn_revenue_by('month', '2026-03-01', '2026-05-01') order by label$$,
  $$values ('2026-03'::text, 30000), ('2026-04', 3000)$$,
  'revenue by month');
select results_eq(
  $$select currency, outstanding_cents::int from public.fn_outstanding()$$,
  $$values ('USD'::text, 37000)$$,
  'outstanding = (quoted 600 - net 330) + a request in a later-added won status (100)');
select is((select refunded_share from public.fn_delivery_stats('2026-03-01', '2026-05-01')), 0.057,
  'refund share = 20 / 350');
select throws_ok($$select * from public.fn_revenue_by('x', now(), now())$$, '22023', null, 'revenue dimensions are whitelisted');

-- `completed` closes a request; leaving it reopens it -------------------------------------------------
update public.service_requests set status = 'completed' where id = '20000000-0000-0000-0000-0000000000e2';
select isnt((select closed_at from public.service_requests where id = '20000000-0000-0000-0000-0000000000e2'), null, 'completed sets closed_at');
update public.service_requests set status = 'in_progress' where id = '20000000-0000-0000-0000-0000000000e2';
select is((select closed_at from public.service_requests where id = '20000000-0000-0000-0000-0000000000e2'), null, 'moving out of completed clears closed_at');

select * from finish();
rollback;
