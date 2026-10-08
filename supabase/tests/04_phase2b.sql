begin;
create extension if not exists pgtap with schema extensions;
select plan(19);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd1@test.local'),
  ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd2@test.local'),
  ('00000000-0000-0000-0000-0000000000d3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd3@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000d1', 'Admin D', 'admin'),
  ('00000000-0000-0000-0000-0000000000d2', 'Agent D', 'agent'),
  ('00000000-0000-0000-0000-0000000000d3', 'Viewer D', 'viewer');
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000d3');
-- Isolate from any dev data: the funnel is computed over a window nothing else touches.
delete from public.payments;
delete from public.service_requests;

insert into public.clients (id, first_name, last_name, email, phone_e164, origin_country) values
  ('10000000-0000-0000-0000-0000000000d1', 'Ana', 'Alpha', 'a@test.local', '+243810000001', 'Guinée'),
  ('10000000-0000-0000-0000-0000000000d2', 'Ana', 'Alpha', 'a2@test.local', '+243810000001', null),
  ('10000000-0000-0000-0000-0000000000d3', 'Bob', 'Beta', 'b@test.local', null, 'Mali');

-- 5 requests in the window: new, contacted, discussed, won (via payment), lost without contact.
insert into public.service_requests (id, client_id, service_type, destination_country, source, submitted_at) values
  ('20000000-0000-0000-0000-0000000000d1', '10000000-0000-0000-0000-0000000000d1', 'assistance', 'Canada', 'website_form', '2026-03-10'),
  ('20000000-0000-0000-0000-0000000000d2', '10000000-0000-0000-0000-0000000000d3', 'assistance', 'Canada', 'website_form', '2026-03-11'),
  ('20000000-0000-0000-0000-0000000000d3', '10000000-0000-0000-0000-0000000000d3', 'consultation', 'France', 'whatsapp',     '2026-03-12'),
  ('20000000-0000-0000-0000-0000000000d4', '10000000-0000-0000-0000-0000000000d3', 'assistance', 'Canada', 'website_form', '2026-03-13'),
  ('20000000-0000-0000-0000-0000000000d5', '10000000-0000-0000-0000-0000000000d3', 'verification', 'Canada', 'referral',   '2026-03-14');
update public.service_requests set status = 'contacted'        where id = '20000000-0000-0000-0000-0000000000d2';
update public.service_requests set status = 'in_discussion'    where id = '20000000-0000-0000-0000-0000000000d3';
update public.service_requests set status = 'awaiting_payment' where id = '20000000-0000-0000-0000-0000000000d4';
update public.service_requests set status = 'deposit_paid'     where id = '20000000-0000-0000-0000-0000000000d4';
update public.service_requests set status = 'lost_failed', lost_reason = 'too_expensive' where id = '20000000-0000-0000-0000-0000000000d5';

select results_eq(
  $$select step, n from public.fn_funnel('2026-03-01', '2026-04-01') order by ord$$,
  $$values ('submitted'::text, 5), ('contacted', 3), ('in_discussion', 2), ('awaiting_payment', 1), ('won', 1)$$,
  'the funnel matches the hand-counted fixture (a request that was paid still counts at every earlier step)');
select is((select n from public.fn_funnel('2026-04-01', '2026-05-01') where step = 'submitted'), 0, 'a window without requests is empty');

select results_eq(
  $$select label, total, won from public.fn_conversion_by('destination', '2026-03-01', '2026-04-01') order by label$$,
  $$values ('Canada'::text, 4, 1), ('France', 1, 0)$$,
  'conversion by destination');
select is((select count(*)::int from public.fn_conversion_by('assignee', '2026-03-01', '2026-04-01')), 1, 'nobody is assigned: one bucket');
select throws_ok($$select * from public.fn_conversion_by('1; drop table clients', '2026-03-01', '2026-04-02')$$, '22023', null, 'dimensions are whitelisted');

select results_eq(
  $$select kind, label, n from public.fn_loss_analysis('2026-03-01', '2026-04-01') where kind = 'reason'$$,
  $$values ('reason'::text, 'Trop cher'::text, 1)$$,
  'loss analysis by reason');
select results_eq(
  $$select label, n from public.fn_loss_analysis('2026-03-01', '2026-04-01') where kind = 'last_status'$$,
  $$values ('Nouvelle demande'::text, 1)$$,
  'loss analysis by last status before the loss');
select is((select contacted_count from public.fn_speed('2026-03-01', '2026-04-01')), 3, 'speed: three requests were contacted');
select is((select won_count from public.fn_speed('2026-03-01', '2026-04-01')), 1, 'speed: one request was won');
select is((select sum(n)::int from public.fn_trend('2026-03-01', '2026-04-01', 'week')), 5, 'trend adds up');

-- Duplicates & merge ------------------------------------------------------------------------
select is((select count(*)::int from public.fn_client_duplicates() where reason = 'phone' and a_id = '10000000-0000-0000-0000-0000000000d1' and b_id = '10000000-0000-0000-0000-0000000000d2'), 1, 'same phone is flagged as a duplicate');

set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-0000000000d3', 'role', 'authenticated')::text, true);
select throws_ok($$select public.merge_clients('10000000-0000-0000-0000-0000000000d1', '10000000-0000-0000-0000-0000000000d2')$$,
  '42501', null, 'a viewer cannot merge clients');
reset role;

update public.service_requests set client_id = '10000000-0000-0000-0000-0000000000d2' where id = '20000000-0000-0000-0000-0000000000d1';
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-0000000000d2', 'role', 'authenticated')::text, true);
select is(public.merge_clients('10000000-0000-0000-0000-0000000000d1', '10000000-0000-0000-0000-0000000000d2'), 1, 'merging moves the dropped client''s requests');
reset role;
select is((select count(*)::int from public.clients where id = '10000000-0000-0000-0000-0000000000d2'), 0, 'the dropped client is gone');
select is((select client_id from public.service_requests where id = '20000000-0000-0000-0000-0000000000d1'), '10000000-0000-0000-0000-0000000000d1'::uuid, 'the request now belongs to the kept client');
select is((select count(*)::int from public.request_events where request_id = '20000000-0000-0000-0000-0000000000d1' and body = 'Client fusionné'), 1, 'the merge is in the request timeline');
select is((select count(*)::int from public.audit_events where type = 'merge_clients' and metadata->>'dropped' = '10000000-0000-0000-0000-0000000000d2'), 1, 'and in the audit log');

-- Round robin ---------------------------------------------------------------------------------
update public.app_settings set value = 'true'::jsonb where key = 'round_robin_enabled';
select is((public.submit_service_request(jsonb_build_object('idempotencyKey', 'rr-key-0001', 'firstName', 'R', 'lastName', 'R',
  'email', 'rr@test.local', 'serviceType', 'information')))->>'duplicate', 'false', 'intake works with round-robin on');
select is((select assigned_to from public.service_requests where idempotency_key = 'rr-key-0001'), '00000000-0000-0000-0000-0000000000d2'::uuid,
  'the new request is assigned to the only active agent');

select * from finish();
rollback;
