-- Phase 4A: MFA enforcement in the database, audit log reader.

insert into public.app_settings (key, value) values ('enforce_mfa', 'false'::jsonb);

-- Once enforced, admin and agent only count as staff on an aal2 (second factor verified) session.
-- Row Level Security is therefore the enforcement point, not just the UI.
create or replace function public.staff_role() returns public.staff_role
language sql stable security definer set search_path = '' as $$
  select p.role
    from public.staff_profiles p
   where p.id = auth.uid() and p.active
     and (
       p.role not in ('admin', 'agent')
       or not coalesce((select s.value = 'true'::jsonb from public.app_settings s where s.key = 'enforce_mfa'), false)
       or coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
     )
$$;

-- The app needs to know whether the second factor is mandatory even before the session is aal2.
create function public.mfa_enforced() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select s.value = 'true'::jsonb from public.app_settings s where s.key = 'enforce_mfa'), false)
$$;
revoke all on function public.mfa_enforced() from public, anon;
grant execute on function public.mfa_enforced() to authenticated;

-- Sign-in activity from the auth service log (admin only).
create function public.fn_login_events(p_from timestamptz, p_to timestamptz)
returns table (at timestamptz, action text, email text, ip_address text)
language sql stable security definer set search_path = '' as $$
  select a.created_at,
         a.payload ->> 'action',
         coalesce(a.payload -> 'traits' ->> 'user_email', a.payload ->> 'actor_username'),
         a.ip_address::text
    from auth.audit_log_entries a
   where public.staff_role() = 'admin'
     and a.created_at >= p_from and a.created_at < p_to
     and a.payload ->> 'action' in ('login', 'logout', 'user_signedup', 'user_invited', 'user_recovery_requested',
                                    'user_modified', 'factor_in_progress', 'factor_unenrolled', 'user_repeated_signup')
   order by a.created_at desc
   limit 500
$$;
revoke all on function public.fn_login_events(timestamptz, timestamptz) from public, anon;
grant execute on function public.fn_login_events(timestamptz, timestamptz) to authenticated;
