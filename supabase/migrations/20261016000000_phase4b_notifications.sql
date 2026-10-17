-- Phase 4B: per-user notification preferences.
alter table public.staff_profiles
  add column notify_new_request boolean not null default true,
  add column notify_digest boolean not null default true;

-- The morning digest only exists for admins and agents: mentors and viewers start opted out.
update public.staff_profiles set notify_digest = false where role not in ('admin', 'agent');
