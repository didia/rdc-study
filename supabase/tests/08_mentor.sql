begin;
create extension if not exists pgtap with schema extensions;
select plan(17);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000a9', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm0@test.local'),
  ('00000000-0000-0000-0000-0000000000b9', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm1@test.local'),
  ('00000000-0000-0000-0000-0000000000c9', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm2@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000a9', 'Admin M', 'admin'),
  ('00000000-0000-0000-0000-0000000000b9', 'Mentor One', 'mentor'),
  ('00000000-0000-0000-0000-0000000000c9', 'Mentor Two', 'mentor');
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000a9', '00000000-0000-0000-0000-0000000000b9', '00000000-0000-0000-0000-0000000000c9');
delete from public.payments;
delete from public.service_requests;

insert into public.clients (id, first_name, last_name, email) values
  ('10000000-0000-0000-0000-0000000000a9', 'Mine', 'Client', 'mine@test.local'),
  ('10000000-0000-0000-0000-0000000000b9', 'Other', 'Client', 'other@test.local');
insert into public.service_requests (id, client_id, service_type, source, status, mentor_id) values
  ('20000000-0000-0000-0000-0000000000a9', '10000000-0000-0000-0000-0000000000a9', 'assistance', 'manual', 'deposit_paid', '00000000-0000-0000-0000-0000000000b9'),
  ('20000000-0000-0000-0000-0000000000b9', '10000000-0000-0000-0000-0000000000b9', 'assistance', 'manual', 'deposit_paid', '00000000-0000-0000-0000-0000000000c9'),
  ('20000000-0000-0000-0000-0000000000c9', '10000000-0000-0000-0000-0000000000b9', 'assistance', 'manual', 'new', null);
insert into public.payments (request_id, kind, amount_cents, method, paid_at, recorded_by)
  values ('20000000-0000-0000-0000-0000000000a9', 'deposit', 20000, 'cash_office', now(), '00000000-0000-0000-0000-0000000000a9');
insert into public.request_documents (request_id, kind, storage_path, file_name, uploaded_by)
  values ('20000000-0000-0000-0000-0000000000a9', 'contract', 'request/20000000-0000-0000-0000-0000000000a9/x-contract.pdf', 'contract.pdf', '00000000-0000-0000-0000-0000000000a9'),
         ('20000000-0000-0000-0000-0000000000b9', 'contract', 'request/20000000-0000-0000-0000-0000000000b9/y-contract.pdf', 'contract.pdf', '00000000-0000-0000-0000-0000000000a9');

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

select pg_temp.act_as('00000000-0000-0000-0000-0000000000b9');
select is((select count(*)::int from public.service_requests), 1, 'a mentor sees only their assigned request');
select is((select count(*)::int from public.service_requests where id = '20000000-0000-0000-0000-0000000000c9'), 0, 'not an unassigned one');
select is((select count(*)::int from public.clients), 1, 'a mentor sees only the client of their request');
select is((select count(*)::int from public.payments), 0, 'a mentor cannot see payments');
select is((select count(*)::int from public.request_events where type = 'payment'), 0, 'nor payment events');
select ok((select count(*) from public.request_events) >= 1, 'but sees the history of their request');
select is((select count(*)::int from public.request_documents), 1, 'a mentor sees only the documents of their request');
select lives_ok($$update public.service_requests set status = 'in_progress', delivery_checklist = '{"choose_program": {"done": true}}'
  where id = '20000000-0000-0000-0000-0000000000a9'$$, 'a mentor can move delivery status and tick the checklist');
select throws_ok($$update public.service_requests set status = 'lost_failed' where id = '20000000-0000-0000-0000-0000000000a9'$$,
  '42501', null, 'a mentor cannot close a request as lost');
select throws_ok($$update public.service_requests set status = 'new' where id = '20000000-0000-0000-0000-0000000000a9'$$,
  '42501', null, 'nor move it backwards to sales statuses');
select throws_ok($$update public.service_requests set assigned_to = '00000000-0000-0000-0000-0000000000b9' where id = '20000000-0000-0000-0000-0000000000a9'$$,
  '42501', null, 'a mentor cannot change other fields');
select throws_ok($$update public.service_requests set mentor_id = '00000000-0000-0000-0000-0000000000c9' where id = '20000000-0000-0000-0000-0000000000a9'$$,
  '42501', null, 'nor hand the request to someone else');
select is(pg_temp.affected($$update public.service_requests set status = 'completed' where id = '20000000-0000-0000-0000-0000000000b9'$$), 0,
  'a mentor cannot touch another mentor''s request');
select lives_ok($$insert into public.request_events (request_id, type, body, actor_id)
  values ('20000000-0000-0000-0000-0000000000a9', 'note', 'Programme choisi', '00000000-0000-0000-0000-0000000000b9')$$, 'a mentor can add a note to their request');
select throws_ok($$insert into public.request_events (request_id, type, body, actor_id)
  values ('20000000-0000-0000-0000-0000000000b9', 'note', 'intrusion', '00000000-0000-0000-0000-0000000000b9')$$,
  '42501', null, 'but not to someone else''s');
reset role;

select pg_temp.act_as('00000000-0000-0000-0000-0000000000c9');
select is((select count(*)::int from public.request_documents where request_id = '20000000-0000-0000-0000-0000000000a9'), 0, 'another mentor cannot see those documents');
reset role;

select is((select count(*)::int from public.request_events where request_id = '20000000-0000-0000-0000-0000000000a9' and type = 'status_change' and to_status = 'in_progress'), 1,
  'the mentor''s status change is on the timeline');

select * from finish();
rollback;
