begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ra@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rg@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'Admin R', 'admin'),
  ('00000000-0000-0000-0000-0000000000a2', 'Agent R', 'agent');
update public.staff_profiles set active = false where id not in ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a2');
delete from public.payments;
delete from public.service_requests;

insert into public.clients (id, first_name, last_name, email, phone, phone_e164, address, origin_country, notes) values
  ('10000000-0000-0000-0000-0000000000a1', 'Old', 'Lost', 'old@test.local', '+243 1', '+2431', 'Rue 1', 'Guinée', 'secret'),
  ('10000000-0000-0000-0000-0000000000a2', 'Recent', 'Lost', 'recent@test.local', null, null, null, 'Mali', null),
  ('10000000-0000-0000-0000-0000000000a3', 'Mixed', 'Open', 'mixed@test.local', null, null, null, 'Mali', null);
insert into public.service_requests (id, client_id, service_type, source, status, original_message, submitted_at) values
  ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'assistance', 'website_form', 'new', 'Je suis Old Lost', '2023-01-01'),
  ('20000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a2', 'assistance', 'website_form', 'new', 'x', '2026-09-01'),
  ('20000000-0000-0000-0000-0000000000a3', '10000000-0000-0000-0000-0000000000a3', 'assistance', 'website_form', 'lost_failed', 'y', '2023-01-01'),
  ('20000000-0000-0000-0000-0000000000a4', '10000000-0000-0000-0000-0000000000a3', 'assistance', 'website_form', 'new', 'z', '2026-09-01');
update public.service_requests set status = 'lost_failed', lost_reason = 'too_expensive' where id = '20000000-0000-0000-0000-0000000000a1';
update public.service_requests set status = 'lost_failed', lost_reason = 'other' where id = '20000000-0000-0000-0000-0000000000a2';
-- age the closures
update public.service_requests set closed_at = now() - interval '30 months' where id in ('20000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a3');
update public.service_requests set closed_at = now() - interval '2 months' where id = '20000000-0000-0000-0000-0000000000a2';
insert into public.request_events (request_id, type, body, actor_id) values ('20000000-0000-0000-0000-0000000000a1', 'note', 'Appel: il habite à Kinshasa', '00000000-0000-0000-0000-0000000000a1');
insert into public.payments (request_id, kind, amount_cents, method, paid_at, recorded_by, external_ref, note)
  values ('20000000-0000-0000-0000-0000000000a1', 'deposit', 20000, 'mobile_money', '2023-02-01', '00000000-0000-0000-0000-0000000000a1', 'MM-1', 'client Old');
insert into public.request_documents (request_id, kind, storage_path, file_name, uploaded_by)
  values ('20000000-0000-0000-0000-0000000000a1', 'client_document', 'request/20000000-0000-0000-0000-0000000000a1/p-passport.pdf', 'passport.pdf', '00000000-0000-0000-0000-0000000000a1');

select results_eq($$select client_id from public.fn_retention_candidates(24)$$, $$values ('10000000-0000-0000-0000-0000000000a1'::uuid)$$,
  'the dry run lists exactly the client whose requests are all closed for over 24 months');

create temp table before_funnel as select step, n from public.fn_funnel('2022-01-01', '2027-01-01');
create temp table before_dest as select label, total, won from public.fn_conversion_by('destination', '2022-01-01', '2027-01-01');

create function pg_temp.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end;
$$;

select pg_temp.act_as('00000000-0000-0000-0000-0000000000a2');
select throws_ok($$select public.anonymise_client('10000000-0000-0000-0000-0000000000a1')$$, '42501', null, 'an agent cannot anonymise');
reset role;

select pg_temp.act_as('00000000-0000-0000-0000-0000000000a1');
select is(public.anonymise_client('10000000-0000-0000-0000-0000000000a1'), array['request/20000000-0000-0000-0000-0000000000a1/p-passport.pdf'],
  'an admin anonymises and gets the document files to delete');
select is((select jsonb_array_length(public.fn_client_export('10000000-0000-0000-0000-0000000000a1')->'requests')), 1, 'the export still works afterwards (without personal data)');
reset role;

select is((select first_name || ' ' || last_name from public.clients where id = '10000000-0000-0000-0000-0000000000a1'), 'Anonymisé Anonymisé', 'the name is gone');
select is((select email from public.clients where id = '10000000-0000-0000-0000-0000000000a1'), null, 'the email is gone');
select is((select count(*)::int from public.clients where id = '10000000-0000-0000-0000-0000000000a1' and phone is null and address is null and notes is null and phone_e164 is null), 1,
  'phone, address and notes are gone');
select is((select original_message from public.service_requests where id = '20000000-0000-0000-0000-0000000000a1'), null, 'the original message is gone');
select is((select body from public.request_events where request_id = '20000000-0000-0000-0000-0000000000a1' and type = 'note'), null, 'notes are cleared');
select is((select count(*)::int from public.payments where request_id = '20000000-0000-0000-0000-0000000000a1' and external_ref is null and note is null and amount_cents = 20000), 1,
  'the payment keeps its amount but loses references');
select is((select count(*)::int from public.request_documents where request_id = '20000000-0000-0000-0000-0000000000a1'), 0, 'documents are removed');
select is((select anonymised_at is not null from public.clients where id = '10000000-0000-0000-0000-0000000000a1'), true, 'the client is marked anonymised (and leaves the candidate list)');
select results_eq($$select step, n from public.fn_funnel('2022-01-01', '2027-01-01')$$, $$select step, n from before_funnel$$, 'dashboard funnel totals are unchanged');
select results_eq($$select label, total, won from public.fn_conversion_by('destination', '2022-01-01', '2027-01-01')$$, $$select label, total, won from before_dest$$, 'and so are the breakdowns');

select * from finish();
rollback;
