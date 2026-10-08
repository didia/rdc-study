begin;
create extension if not exists pgtap with schema extensions;
select plan(22);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e1@test.local'),
  ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e2@test.local'),
  ('00000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'e3@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000e1', 'Admin E', 'admin'),
  ('00000000-0000-0000-0000-0000000000e2', 'Agent E', 'agent'),
  ('00000000-0000-0000-0000-0000000000e3', 'Viewer E', 'viewer');
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e3');
delete from public.payments;
delete from public.service_requests;

insert into public.clients (id, first_name, last_name, email) values ('10000000-0000-0000-0000-0000000000e1', 'Pay', 'Er', 'pay@test.local');
insert into public.service_requests (id, client_id, service_type, destination_country, package_slug, source, status, quoted_price_cents)
  values ('20000000-0000-0000-0000-0000000000e1', '10000000-0000-0000-0000-0000000000e1', 'assistance', 'Canada', 'canada/visa', 'manual', 'awaiting_payment', 60000);

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
select is(pg_temp.affected('update public.payments set amount_cents = 1'), 0, 'an agent cannot edit a payment');
select throws_ok($$delete from public.payments$$, '42501', null, 'an agent cannot delete payments');
select is((select count(*)::int from public.request_events where request_id = '20000000-0000-0000-0000-0000000000e1' and type = 'payment'), 4,
  'each payment is on the timeline');
reset role;

-- Viewers see no money -----------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000e3');
select is((select count(*)::int from public.payments), 0, 'a viewer cannot see payments');
select is((select count(*)::int from public.request_paid), 0, 'nor the paid totals');
reset role;

-- Admin voids -----------------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000e1');
select throws_ok($$update public.payments set amount_cents = 1 where kind = 'refund'$$, 'P0001', null, 'even an admin cannot change an amount');
select throws_ok($$update public.payments set voided_at = now() where kind = 'refund'$$, 'P0001', null, 'a void needs a reason');
select throws_ok($$delete from public.payments$$, '42501', null, 'nobody can delete payments (no privilege)');
select lives_ok($$update public.payments set voided_at = now(), void_reason = 'Saisie en double' where kind = 'balance' and currency = 'CDF'$$, 'an admin can void a payment');
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
  $$values ('USD'::text, 27000)$$,
  'outstanding = quoted 600 - net 330');
select is((select refunded_share from public.fn_delivery_stats('2026-03-01', '2026-05-01')), 0.057,
  'refund share = 20 / 350');
select throws_ok($$select * from public.fn_revenue_by('x', now(), now())$$, '22023', null, 'revenue dimensions are whitelisted');

select * from finish();
rollback;
