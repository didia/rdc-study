begin;
create extension if not exists pgtap with schema extensions;
select plan(39);

-- Fixtures -----------------------------------------------------------------
insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'agent@test.local'),
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'viewer@test.local'),
  ('00000000-0000-0000-0000-0000000000a4', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'gone@test.local');
insert into public.staff_profiles (id, full_name, role, active) values
  ('00000000-0000-0000-0000-0000000000a1', 'Test Admin', 'admin', true),
  ('00000000-0000-0000-0000-0000000000a2', 'Test Agent', 'agent', true),
  ('00000000-0000-0000-0000-0000000000a3', 'Test Viewer', 'viewer', true),
  ('00000000-0000-0000-0000-0000000000a4', 'Test Inactive', 'agent', false);
insert into public.clients (id, first_name, last_name, email) values
  ('10000000-0000-0000-0000-000000000001', 'Alice', 'Example', 'alice@test.local');
insert into public.service_requests (id, client_id, service_type, source)
values ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'assistance', 'manual');

create function pg_temp.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end;
$$;
create function pg_temp.act_as_anon() returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', '{}', true);
  set local role anon;
end;
$$;
create function pg_temp.affected(stmt text) returns int language plpgsql as $$
declare n int;
begin
  execute stmt;
  get diagnostics n = row_count;
  return n;
end;
$$;
create function pg_temp.reset_role() returns void language plpgsql as $$
begin
  reset role;
end;
$$;

-- anon -----------------------------------------------------------------------
select pg_temp.act_as_anon();
select throws_ok($$select * from public.clients$$, '42501', null, 'anon cannot read clients');
select throws_ok($$select * from public.service_requests$$, '42501', null, 'anon cannot read requests');
select throws_ok($$select * from public.service_prices$$, '42501', null, 'anon cannot read prices');
select throws_ok($$select * from public.staff_profiles$$, '42501', null, 'anon cannot read staff');
select throws_ok($$select * from public.request_events$$, '42501', null, 'anon cannot read events');
select throws_ok($$insert into public.clients (first_name, last_name) values ('x','y')$$, '42501', null, 'anon cannot insert');
select pg_temp.reset_role();

-- guard rails for future migrations (new tables/functions inherit Supabase's permissive defaults)
select is((select count(*)::int from information_schema.role_table_grants
            where grantee = 'anon' and table_schema = 'public'), 0, 'anon holds no privilege on any public table');
select is((select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute')), 0,
          'anon can execute no public function');

-- inactive staff ---------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000a4');
select is((select count(*)::int from public.service_requests), 0, 'inactive staff see no requests');
select is((select count(*)::int from public.clients), 0, 'inactive staff see no clients');
select is((select count(*)::int from public.staff_profiles), 1, 'inactive staff only see their own profile');
select pg_temp.reset_role();

-- viewer -----------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000a3');
select is((select count(*)::int from public.service_requests), 1, 'viewer can read requests');
select throws_ok($$insert into public.clients (first_name, last_name) values ('x','y')$$, '42501', null, 'viewer cannot insert clients');
select is(pg_temp.affected('update public.service_requests set has_dispute = true'), 0, 'viewer cannot update requests');
select pg_temp.reset_role();

-- agent ------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000a2');
update public.service_requests set status = 'contacted', status_reason = 'Premier contact WhatsApp'
 where id = '20000000-0000-0000-0000-000000000001';
select is((select count(*)::int from public.request_events
            where request_id = '20000000-0000-0000-0000-000000000001' and type = 'status_change'),
          1, 'status change writes exactly one status_change event');
select is((select actor_id from public.request_events
            where request_id = '20000000-0000-0000-0000-000000000001' and type = 'status_change'),
          '00000000-0000-0000-0000-0000000000a2'::uuid, 'status_change event records the actor');
select is((select count(*)::int from public.request_events
            where request_id = '20000000-0000-0000-0000-000000000001' and type = 'created'),
          1, 'creating a request writes a created event');
update public.service_requests set assigned_to = '00000000-0000-0000-0000-0000000000a2'
 where id = '20000000-0000-0000-0000-000000000001';
select is((select count(*)::int from public.request_events
            where request_id = '20000000-0000-0000-0000-000000000001' and type = 'assignment'),
          1, 'assignment writes an event');
select lives_ok($$insert into public.request_events (request_id, type, body, actor_id)
  values ('20000000-0000-0000-0000-000000000001', 'note', 'hello', '00000000-0000-0000-0000-0000000000a2')$$,
  'agent can add a note');
select throws_ok($$insert into public.request_events (request_id, type, to_status, actor_id)
  values ('20000000-0000-0000-0000-000000000001', 'status_change', 'paid', '00000000-0000-0000-0000-0000000000a2')$$,
  '42501', null, 'agent cannot forge a status_change event');
select throws_ok($$insert into public.request_events (request_id, type, body, actor_id)
  values ('20000000-0000-0000-0000-000000000001', 'note', 'spoof', '00000000-0000-0000-0000-0000000000a1')$$,
  '42501', null, 'agent cannot write an event as someone else');
select throws_ok($$update public.request_events set body = 'x'$$, '42501', null, 'events are not updatable');
select throws_ok($$delete from public.request_events$$, '42501', null, 'events are not deletable');
select is(pg_temp.affected('delete from public.service_requests'), 0, 'agent cannot delete requests');
select is(pg_temp.affected('update public.service_prices set amount_cents = 1'), 0, 'agent cannot update prices');
select throws_ok($$update public.staff_profiles set role = 'admin' where id = '00000000-0000-0000-0000-0000000000a2'$$,
  '42501', null, 'agent cannot promote themselves');
select lives_ok($$update public.staff_profiles set full_name = 'Renamed Agent' where id = '00000000-0000-0000-0000-0000000000a2'$$,
  'agent can edit their own name');
select pg_temp.reset_role();

-- request lifecycle fields -------------------------------------------------------
update public.service_requests set status = 'lost_no_response' where id = '20000000-0000-0000-0000-000000000001';
select isnt((select closed_at from public.service_requests where id = '20000000-0000-0000-0000-000000000001'), null,
  'closed_at is set when entering a lost status');
update public.service_requests set status = 'contacted' where id = '20000000-0000-0000-0000-000000000001';
select is((select closed_at from public.service_requests where id = '20000000-0000-0000-0000-000000000001'), null,
  'closed_at is cleared on reopen');

-- updated_at is not bumped by activity-only touches (optimistic concurrency) ----------
create temp table before_note as
  select updated_at from public.service_requests where id = '20000000-0000-0000-0000-000000000001';
insert into public.request_events (request_id, type, body)
  values ('20000000-0000-0000-0000-000000000001', 'note', 'later note');
select is((select updated_at from public.service_requests where id = '20000000-0000-0000-0000-000000000001'),
          (select updated_at from before_note), 'adding a note does not change updated_at');

-- admin & prices -----------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-0000000000a1');
select set_config('app.price_reason', 'test', true);
update public.service_prices set amount_cents = 45000 where service_type = 'assistance' and scope = '*';
select is((select count(*)::int from public.service_price_history where service_type = 'assistance' and scope = '*'), 1,
  'an admin price update leaves one history row');
select is((select old_amount_cents from public.service_price_history where reason = 'test'), 40000,
  'history records the old amount and reason');
select throws_ok($$delete from public.service_prices$$, '42501', null, 'prices cannot be deleted');
select throws_ok($$update public.service_price_history set reason = 'x'$$, '42501', null, 'price history is not updatable');
select throws_ok($$update public.staff_profiles set role = 'viewer' where id = '00000000-0000-0000-0000-0000000000a1'$$,
  'P0001', null, 'the last active admin cannot be demoted');
select pg_temp.reset_role();

-- resolve_price ---------------------------------------------------------------------
select is(public.resolve_price('assistance', 'canada/visa'), 60000, 'visa packages cost the visa price');
select is(public.resolve_price('assistance', 'canada/admission'), 45000, 'admission uses the default price');
select is(public.resolve_price('assistance', 'belgique/equivalence'), 45000, 'équivalence uses the default price');
insert into public.service_prices (service_type, scope, amount_cents) values ('assistance', 'pkg:canada/visa', 70000);
select is(public.resolve_price('assistance', 'canada/visa'), 70000, 'a package override beats the kind price');

select * from finish();
rollback;
