begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c1@test.local'),
  ('00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c2@test.local'),
  ('00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c3@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000c1', 'Admin C', 'admin'),
  ('00000000-0000-0000-0000-0000000000c2', 'Agent C', 'agent'),
  ('00000000-0000-0000-0000-0000000000c3', 'Viewer C', 'viewer');
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000c3');
insert into public.clients (id, first_name, last_name, email) values ('10000000-0000-0000-0000-0000000000c1', 'Lo', 'St', 'lost@test.local');
insert into public.service_requests (id, client_id, service_type, source)
  values ('20000000-0000-0000-0000-0000000000c1', '10000000-0000-0000-0000-0000000000c1', 'consultation', 'manual');

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

-- lost reasons follow the status
update public.service_requests set status = 'lost_failed', lost_reason = 'too_expensive' where id = '20000000-0000-0000-0000-0000000000c1';
select is((select metadata->>'lost_reason' from public.request_events
            where request_id = '20000000-0000-0000-0000-0000000000c1' and type = 'status_change'), 'too_expensive',
          'the status_change event records the lost reason');
update public.service_requests set status = 'contacted' where id = '20000000-0000-0000-0000-0000000000c1';
select is((select lost_reason from public.service_requests where id = '20000000-0000-0000-0000-0000000000c1'), null,
          'reopening clears the lost reason');

-- templates: admins write, agents read
select pg_temp.act_as('00000000-0000-0000-0000-0000000000c2');
select ok((select count(*) from public.message_templates) >= 5, 'agents can read templates');
select is(pg_temp.affected($$update public.message_templates set label = 'x'$$), 0, 'agents cannot edit templates');
select is(pg_temp.affected($$update public.lost_reasons set label_fr = 'x'$$), 0, 'agents cannot edit lost reasons');

-- saved views: private unless shared
insert into public.saved_views (owner_id, name, params, shared) values
  ('00000000-0000-0000-0000-0000000000c2', 'Mes relances', '{"assignee":"me"}', false),
  ('00000000-0000-0000-0000-0000000000c2', 'Canada', '{"destination":"Canada"}', true);
select throws_ok($$insert into public.saved_views (owner_id, name, params) values ('00000000-0000-0000-0000-0000000000c1', 'spoof', '{}')$$,
  '42501', null, 'a view cannot be created for someone else');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000c3');
select is((select count(*)::int from public.saved_views), 1, 'a viewer only sees shared views of others');
reset role;

-- audit events are append-only and admin-readable
select pg_temp.act_as('00000000-0000-0000-0000-0000000000c2');
select lives_ok($$insert into public.audit_events (actor_id, type, metadata) values ('00000000-0000-0000-0000-0000000000c2', 'export', '{"rows": 3}')$$,
  'an agent can log an export');
select throws_ok($$insert into public.audit_events (actor_id, type) values ('00000000-0000-0000-0000-0000000000c1', 'export')$$,
  '42501', null, 'an agent cannot log an export as someone else');
select is((select count(*)::int from public.audit_events), 0, 'agents cannot read the audit log');
select throws_ok($$update public.audit_events set type = 'x'$$, '42501', null, 'audit events are not updatable');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000c3');
select throws_ok($$insert into public.audit_events (actor_id, type) values ('00000000-0000-0000-0000-0000000000c3', 'export')$$,
  '42501', null, 'viewers cannot log exports (they cannot export)');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000c1');
select ok((select count(*) from public.audit_events) >= 1, 'admins can read the audit log');
reset role;

select * from finish();
rollback;
