begin;
create extension if not exists pgtap with schema extensions;
select plan(25);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'padmin@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pagent@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000b1', 'Price Admin', 'admin'),
  ('00000000-0000-0000-0000-0000000000b2', 'Price Agent', 'agent');
-- A dev database may hold real staff: neutralise them so the tests are deterministic.
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000b2');

create function pg_temp.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end;
$$;

-- Who may call what ------------------------------------------------------------------
set local role anon;
select throws_ok($$select public.submit_service_request('{}'::jsonb)$$, '42501', null, 'anon cannot submit through the function');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000b1');
select throws_ok($$select public.submit_service_request('{}'::jsonb)$$, '42501', null, 'even an admin cannot call the intake function');
select throws_ok($$select public.check_rate_limit('k', 1, 60)$$, '42501', null, 'staff cannot call the rate limiter');
reset role;

-- Intake as service_role --------------------------------------------------------------
set local role service_role;
select is((public.submit_service_request(jsonb_build_object(
  'idempotencyKey', 'key-1', 'firstName', 'Test', 'lastName', 'Person', 'email', 'Intake@Test.Local',
  'phone', '+243 81 000 0000', 'phoneE164', '+243810000000', 'originCountry', 'Guinée',
  'serviceType', 'assistance', 'packageSlug', 'canada/visa', 'destinationCountry', 'Canada',
  'message', 'hello', 'sourceUrl', 'https://x.test/', 'displayedPriceCents', 12345,
  'formAnswers', jsonb_build_object('hasAdmission', true)
)))->>'duplicate', 'false', 'first submission creates a request');
select is((select quoted_price_cents from public.service_requests where idempotency_key = 'key-1'), 60000,
  'quoted price comes from the database (visa), not from the payload');
select is((select displayed_price_cents from public.service_requests where idempotency_key = 'key-1'), 12345,
  'the displayed price is stored separately');
select is((select status from public.service_requests where idempotency_key = 'key-1'), 'new', 'new requests start as new');
select is((select source from public.service_requests where idempotency_key = 'key-1'), 'website_form', 'source is website_form');
select is((select count(*)::int from public.request_events e join public.service_requests r on r.id = e.request_id
            where r.idempotency_key = 'key-1' and e.type = 'created'), 1, 'a created event is logged');

select is((public.submit_service_request(jsonb_build_object(
  'idempotencyKey', 'key-1', 'firstName', 'Test', 'lastName', 'Person', 'email', 'intake@test.local', 'serviceType', 'assistance'
)))->>'duplicate', 'true', 'same idempotency key returns the original request');
select is((select count(*)::int from public.service_requests where idempotency_key = 'key-1'), 1, 'and creates no second request');

select public.submit_service_request(jsonb_build_object(
  'idempotencyKey', 'key-2', 'firstName', 'Other', 'lastName', 'Name', 'email', 'intake@test.local',
  'serviceType', 'assistance', 'packageSlug', 'canada/admission'));
select is((select count(*)::int from public.clients where email = 'intake@test.local'), 1, 'same email twice gives one client');
select is((select count(*)::int from public.service_requests r join public.clients c on c.id = r.client_id
            where c.email = 'intake@test.local'), 2, 'with two requests');
select is((select quoted_price_cents from public.service_requests where idempotency_key = 'key-2'), 40000, 'admission is quoted at the default price');
select is((select first_name from public.clients where email = 'intake@test.local'), 'Test', 'an existing client name is not overwritten');
reset role;

-- Rate limit -----------------------------------------------------------------------------
set local role service_role;
select is(public.check_rate_limit('ip-a', 2, 3600), true, 'first hit passes');
select is(public.check_rate_limit('ip-a', 2, 3600), true, 'second hit passes');
select is(public.check_rate_limit('ip-a', 2, 3600), false, 'third hit is refused');
select is(public.check_rate_limit('ip-b', 2, 3600), true, 'other keys are independent');
reset role;

-- Price editing RPC ------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000b2');
select throws_ok($$select public.set_service_price('assistance', '*', 1, 'agent attempt')$$, '42501', null, 'an agent cannot change prices');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000b1');
select lives_ok($$select public.set_service_price('assistance', 'pkg:canada/visa', 65000, 'Promo test')$$, 'an admin can add an exception');
select is((select reason from public.service_price_history where scope = 'pkg:canada/visa'), 'Promo test', 'the reason is recorded in the history');
select lives_ok($$select public.remove_service_price('assistance', 'pkg:canada/visa', 'Promo over')$$, 'an admin can remove an exception');
select is((select count(*)::int from public.service_price_history where scope = 'pkg:canada/visa' and new_amount_cents is null), 1, 'removal is kept in the history');
select is(public.resolve_price('assistance', 'canada/visa'), 60000, 'the kind price applies again');
reset role;

select * from finish();
rollback;
