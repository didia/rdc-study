begin;
create extension if not exists pgtap with schema extensions;
select plan(20);

insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'f1@test.local'),
  ('00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'f2@test.local'),
  ('00000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'f3@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000f1', 'Admin F', 'admin'),
  ('00000000-0000-0000-0000-0000000000f2', 'Agent F', 'agent'),
  ('00000000-0000-0000-0000-0000000000f3', 'Viewer F', 'viewer');
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f3');
insert into public.clients (id, first_name, last_name, email) values ('10000000-0000-0000-0000-0000000000f1', 'Do', 'Cs', 'docs@test.local');
insert into public.service_requests (id, client_id, service_type, source)
  values ('20000000-0000-0000-0000-0000000000f1', '10000000-0000-0000-0000-0000000000f1', 'assistance', 'manual');

create function pg_temp.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end;
$$;

select is((select public from storage.buckets where id = 'request-docs'), false, 'the bucket is private');
select is((select file_size_limit from storage.buckets where id = 'request-docs'), 10485760::bigint, '10 MB limit');
select ok(not ('image/svg+xml' = any ((select allowed_mime_types from storage.buckets where id = 'request-docs')::text[])), 'SVG (script-capable) is not allowed');

-- Agent uploads and registers
select pg_temp.act_as('00000000-0000-0000-0000-0000000000f2');
select lives_ok($$insert into storage.objects (bucket_id, name, owner) values
  ('request-docs', 'request/20000000-0000-0000-0000-0000000000f1/aaaa-contract.pdf', '00000000-0000-0000-0000-0000000000f2')$$,
  'an agent can upload into request/');
select throws_ok($$insert into storage.objects (bucket_id, name, owner) values ('request-docs', 'elsewhere/x.pdf', '00000000-0000-0000-0000-0000000000f2')$$,
  '42501', null, 'uploads outside request/ are refused');
select lives_ok($$insert into public.request_documents (request_id, kind, storage_path, file_name, mime_type, size_bytes, uploaded_by)
  values ('20000000-0000-0000-0000-0000000000f1', 'contract', 'request/20000000-0000-0000-0000-0000000000f1/aaaa-contract.pdf',
          'contract.pdf', 'application/pdf', 1234, '00000000-0000-0000-0000-0000000000f2')$$, 'an agent can register a document');
select throws_ok($$insert into public.request_documents (request_id, kind, storage_path, file_name, uploaded_by)
  values ('20000000-0000-0000-0000-0000000000f1', 'other', 'request/other-request/x.pdf', 'x.pdf', '00000000-0000-0000-0000-0000000000f2')$$,
  '23514', null, 'the path must belong to the request');
select is((select count(*)::int from public.request_events where request_id = '20000000-0000-0000-0000-0000000000f1' and type = 'document'), 1,
  'the upload is on the timeline');
select is((select count(*)::int from storage.objects where name like 'request/20000000-0000-0000-0000-0000000000f1/%'), 1,
  'an agent can read a registered object');
select throws_ok($$delete from public.request_documents$$, '42501', null, 'documents cannot be deleted');
reset role;

-- An object without a document row stays invisible; viewers see nothing
insert into storage.objects (bucket_id, name) values ('request-docs', 'request/20000000-0000-0000-0000-0000000000f1/orphan.pdf');
select pg_temp.act_as('00000000-0000-0000-0000-0000000000f2');
select is((select count(*)::int from storage.objects where name like '%orphan.pdf'), 0, 'an unregistered object is not readable');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000f3');
select is((select count(*)::int from storage.objects where bucket_id = 'request-docs'), 0, 'a viewer cannot read any document (no signed URL can be minted)');
reset role;

-- A failed registration can be cleaned up, a registered document cannot be removed from storage.
-- Raw deletes from storage tables are blocked by a trigger unless the Storage API's flag is set: mimic the API here.
reset role;
select set_config('storage.allow_delete_query', 'true', true);
insert into storage.objects (bucket_id, name) values ('request-docs', 'request/20000000-0000-0000-0000-0000000000f1/failed.pdf');
select pg_temp.act_as('00000000-0000-0000-0000-0000000000f2');
delete from storage.objects where name = 'request/20000000-0000-0000-0000-0000000000f1/failed.pdf';
delete from storage.objects where name = 'request/20000000-0000-0000-0000-0000000000f1/aaaa-contract.pdf';
reset role;
select is((select count(*)::int from storage.objects where name = 'request/20000000-0000-0000-0000-0000000000f1/failed.pdf'), 0,
  'staff can remove an unregistered object');
select is((select count(*)::int from storage.objects where name = 'request/20000000-0000-0000-0000-0000000000f1/aaaa-contract.pdf'), 1,
  'a registered document stays in storage');
select pg_temp.act_as('00000000-0000-0000-0000-0000000000f3');
delete from storage.objects where name = 'request/20000000-0000-0000-0000-0000000000f1/orphan.pdf';
reset role;
select is((select count(*)::int from storage.objects where name = 'request/20000000-0000-0000-0000-0000000000f1/orphan.pdf'), 1,
  'a viewer cannot remove objects');

-- Merging duplicate clients keeps the address
insert into public.clients (id, first_name, last_name, address) values
  ('10000000-0000-0000-0000-0000000000f2', 'Keep', 'NoAddress', null),
  ('10000000-0000-0000-0000-0000000000f3', 'Donor', 'WithAddress', 'Kinshasa, Gombe'),
  ('10000000-0000-0000-0000-0000000000f4', 'Keep', 'HasAddress', 'Lubumbashi'),
  ('10000000-0000-0000-0000-0000000000f5', 'Donor', 'OtherAddress', 'Goma');
select pg_temp.act_as('00000000-0000-0000-0000-0000000000f2');
select lives_ok($$select public.merge_clients('10000000-0000-0000-0000-0000000000f2', '10000000-0000-0000-0000-0000000000f3')$$, 'agent merges into a keeper without address');
select lives_ok($$select public.merge_clients('10000000-0000-0000-0000-0000000000f4', '10000000-0000-0000-0000-0000000000f5')$$, 'agent merges into a keeper with address');
reset role;
select is((select address from public.clients where id = '10000000-0000-0000-0000-0000000000f2'), 'Kinshasa, Gombe', 'the keeper inherits the donor''s address');
select is((select address from public.clients where id = '10000000-0000-0000-0000-0000000000f4'), 'Lubumbashi', 'an existing address is not overwritten');

-- Templates are versioned: only admins add versions
select pg_temp.act_as('00000000-0000-0000-0000-0000000000f2');
select throws_ok($$insert into public.document_templates (kind, version, title, body, created_by) values ('contract', 2, 't', 'b', '00000000-0000-0000-0000-0000000000f2')$$,
  '42501', null, 'agents cannot edit templates');
reset role;

select * from finish();
rollback;
