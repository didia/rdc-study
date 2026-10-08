begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

-- Every table in public must have RLS enabled: a new table without it fails CI.
select is((select string_agg(c.relname, ', ') from pg_class c join pg_namespace n on n.oid = c.relnamespace
            where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity), null, 'every public table has RLS enabled');
-- ... and every public table has at least one policy or no privileges for authenticated (default deny stays meaningful).
select is((select string_agg(c.relname, ', ') from pg_class c join pg_namespace n on n.oid = c.relnamespace
            where n.nspname = 'public' and c.relkind = 'r'
              and not exists (select 1 from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname)
              and has_table_privilege('authenticated', c.oid, 'SELECT')), null, 'tables readable by authenticated all have policies');
-- Security definer functions must pin their search_path.
select is((select string_agg(p.proname, ', ') from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.prosecdef
              and not exists (select 1 from unnest(coalesce(p.proconfig, '{}'::text[])) cfg where cfg like 'search_path=%')), null,
          'every security definer function sets search_path');

-- MFA enforcement
insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sa@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sg@test.local'),
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sv@test.local');
insert into public.staff_profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'Admin S', 'admin'),
  ('00000000-0000-0000-0000-0000000000a2', 'Agent S', 'agent'),
  ('00000000-0000-0000-0000-0000000000a3', 'Viewer S', 'viewer');
update public.staff_profiles set active = false
 where id not in ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000a3');

create function pg_temp.act_as(uid uuid, aal text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated', 'aal', aal)::text, true);
  set local role authenticated;
end;
$$;

select pg_temp.act_as('00000000-0000-0000-0000-0000000000a2', 'aal1');
select is(public.staff_role()::text, 'agent', 'without enforcement an aal1 agent is staff');
reset role;

update public.app_settings set value = 'true'::jsonb where key = 'enforce_mfa';

select pg_temp.act_as('00000000-0000-0000-0000-0000000000a2', 'aal1');
select is(public.staff_role()::text, null, 'with enforcement an aal1 agent is not staff');
select is((select count(*)::int from public.staff_profiles), 1, 'and can still read their own profile (to enrol)');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000a2', 'aal2');
select is(public.staff_role()::text, 'agent', 'an aal2 agent is staff');
reset role;
select pg_temp.act_as('00000000-0000-0000-0000-0000000000a3', 'aal1');
select is(public.staff_role()::text, 'viewer', 'viewers are not forced into MFA');
reset role;

select * from finish();
rollback;
