-- Phase 4B: per-user notification preferences.
alter table public.staff_profiles
  add column notify_new_request boolean not null default true,
  add column notify_digest boolean not null default true;
