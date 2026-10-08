-- Phase 1 core schema: staff, clients, service requests, history, editable prices.
-- See specs/todo/admin-interface/01-data-model.md

create extension if not exists citext with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create type public.staff_role as enum ('admin', 'agent', 'mentor', 'viewer');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.staff_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null,
  role        public.staff_role not null default 'viewer',
  active      boolean not null default true,
  whatsapp    text,
  created_at  timestamptz not null default now()
);

create table public.request_statuses (
  code        text primary key,
  label_fr    text not null,
  stage       text not null check (stage in ('open', 'won', 'lost')),
  sort_order  int  not null,
  color       text,
  is_active   boolean not null default true
);

create table public.clients (
  id                uuid primary key default gen_random_uuid(),
  first_name        text not null,
  last_name         text not null,
  email             extensions.citext,
  phone             text,
  phone_e164        text,
  origin_country    text,
  preferred_channel text check (preferred_channel in ('whatsapp', 'email')),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create unique index clients_email_uq on public.clients (email) where email is not null;
create index clients_phone_idx on public.clients (phone_e164);
create index clients_name_trgm on public.clients
  using gin ((first_name || ' ' || last_name) extensions.gin_trgm_ops);

create sequence public.request_ref_seq;

create table public.service_requests (
  id                    uuid primary key default gen_random_uuid(),
  reference             text unique not null default
                          'RDC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.request_ref_seq')::text, 4, '0'),
  client_id             uuid not null references public.clients (id) on delete restrict,
  service_type          text not null,
  destination_country   text,
  package_slug          text,
  status                text not null default 'new' references public.request_statuses (code),
  status_reason         text,
  has_dispute           boolean not null default false,
  source                text not null check (source in ('website_form', 'manual', 'whatsapp', 'referral')),
  source_url            text,
  original_message      text,
  form_answers          jsonb not null default '{}',
  assigned_to           uuid references public.staff_profiles (id),
  next_follow_up_at     timestamptz,
  submitted_at          timestamptz not null default now(),
  last_activity_at      timestamptz not null default now(),
  closed_at             timestamptz,
  idempotency_key       text unique,
  quoted_price_cents    int,
  quoted_currency       text default 'USD',
  displayed_price_cents int,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index sr_status_idx    on public.service_requests (status);
create index sr_assigned_idx  on public.service_requests (assigned_to);
create index sr_submitted_idx on public.service_requests (submitted_at desc);
create index sr_followup_idx  on public.service_requests (next_follow_up_at) where next_follow_up_at is not null;
create index sr_client_idx    on public.service_requests (client_id);

create table public.service_prices (
  service_type  text not null,
  scope         text not null default '*',
  amount_cents  int not null check (amount_cents >= 0),
  currency      text not null default 'USD',
  updated_at    timestamptz not null default now(),
  updated_by    uuid references public.staff_profiles (id),
  primary key (service_type, scope),
  check (scope = '*' or scope ~ '^(kind|pkg):[a-z0-9/-]+$'),
  check (service_type <> 'information' or amount_cents = 0)
);

create table public.service_price_history (
  id                bigint generated always as identity primary key,
  service_type      text not null,
  scope             text not null,
  old_amount_cents  int,
  new_amount_cents  int not null,
  currency          text not null,
  reason            text,
  changed_by        uuid references public.staff_profiles (id),
  changed_at        timestamptz not null default now()
);

create table public.request_events (
  id          bigint generated always as identity primary key,
  request_id  uuid not null references public.service_requests (id) on delete cascade,
  type        text not null check (type in
                ('created', 'status_change', 'note', 'contact_attempt', 'assignment', 'field_change', 'payment', 'document')),
  from_status text,
  to_status   text,
  channel     text check (channel in ('whatsapp', 'email', 'phone', 'office', 'other')),
  body        text,
  metadata    jsonb not null default '{}',
  actor_id    uuid references public.staff_profiles (id),
  created_at  timestamptz not null default now()
);
create index re_request_idx on public.request_events (request_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Seed data (reference data, needed in every environment)
-- ---------------------------------------------------------------------------

insert into public.request_statuses (code, label_fr, stage, sort_order, color, is_active) values
  ('new',              'Nouvelle demande',        'open', 10,  '#2563eb', true),
  ('contacted',        'Contact initial',         'open', 20,  '#0891b2', true),
  ('in_discussion',    'En discussion',           'open', 30,  '#7c3aed', true),
  ('awaiting_client',  'En attente du client',    'open', 40,  '#d97706', true),
  ('follow_up',        'Relancé',                 'open', 50,  '#ea580c', true),
  ('office_visit',     'Va passer au bureau',     'open', 60,  '#0d9488', true),
  ('awaiting_payment', 'En attente de paiement',  'open', 70,  '#ca8a04', true),
  ('deposit_paid',     'Acompte payé',            'won',  80,  '#16a34a', true),
  ('paid',             'Payé intégralement',      'won',  90,  '#15803d', false),
  ('in_progress',      'Accompagnement en cours', 'won',  100, '#166534', false),
  ('completed',        'Terminé',                 'won',  110, '#14532d', false),
  ('lost_failed',      'Échec',                   'lost', 120, '#dc2626', true),
  ('lost_no_response', 'Sans suite',              'lost', 130, '#6b7280', true);

insert into public.service_prices (service_type, scope, amount_cents) values
  ('information',            '*',         0),
  ('consultation',           '*',         3000),
  ('verification',           '*',         15000),
  ('verification-et-lettre', '*',         20000),
  ('guides-de-demarche',     '*',         0),
  ('assistance',             '*',         40000),
  ('assistance',             'kind:visa', 60000);

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------

-- Role of the caller when they are an active staff member, else null.
create function public.staff_role() returns public.staff_role
language sql stable security definer set search_path = ''
as $$
  select role from public.staff_profiles where id = auth.uid() and active
$$;

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- service_requests: stamp updated_at (but not when only last_activity_at moved, so
-- optimistic concurrency on updated_at is not broken by appending notes), maintain closed_at.
create function public.service_requests_before_write() returns trigger
language plpgsql set search_path = '' as $$
declare
  new_stage text;
  status_changed boolean := true;
begin
  if tg_op = 'UPDATE' then
    if (to_jsonb(new) - 'last_activity_at' - 'updated_at')
       is distinct from (to_jsonb(old) - 'last_activity_at' - 'updated_at') then
      new.updated_at = now();
    else
      new.updated_at = old.updated_at;
    end if;
    status_changed := new.status is distinct from old.status;
  end if;

  if status_changed then
    select stage into new_stage from public.request_statuses where code = new.status;
    if new_stage = 'lost' then
      new.closed_at = coalesce(new.closed_at, now());
    else
      new.closed_at = null;
    end if;
  end if;
  return new;
end;
$$;

-- Every status / assignment change leaves an immutable event; no code path can skip it.
create function public.log_request_changes() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.request_events (request_id, type, to_status, actor_id, metadata)
    values (new.id, 'created', new.status, auth.uid(), jsonb_build_object('source', new.source));
    return null;
  end if;

  if new.status is distinct from old.status then
    insert into public.request_events (request_id, type, from_status, to_status, body, actor_id)
    values (new.id, 'status_change', old.status, new.status, new.status_reason, auth.uid());
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.id, 'assignment', null, auth.uid(),
            jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;
  return null;
end;
$$;

create function public.touch_request_on_event() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.service_requests set last_activity_at = now() where id = new.request_id;
  return null;
end;
$$;

-- Staff profile guard: self-service edits are limited to name/whatsapp, and the last
-- active admin can never be demoted, deactivated or deleted.
create function public.staff_profiles_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  other_admins int;
  demoting boolean;
begin
  if tg_op = 'UPDATE' then
    if auth.uid() is not null and public.staff_role() is distinct from 'admin'
       and (new.id <> old.id or new.role <> old.role or new.active <> old.active) then
      raise exception 'Only an admin can change role or active status' using errcode = '42501';
    end if;
    demoting := new.role <> 'admin' or not new.active;
  else
    demoting := true;
  end if;

  if old.role = 'admin' and old.active and demoting then
    select count(*) into other_admins
      from public.staff_profiles where role = 'admin' and active and id <> old.id;
    if other_admins = 0 then
      raise exception 'Cannot remove the last active admin' using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- service_prices: stamp the editor, then record history.
create function public.service_prices_stamp() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

create function public.log_price_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' or new.amount_cents is distinct from old.amount_cents then
    insert into public.service_price_history
      (service_type, scope, old_amount_cents, new_amount_cents, currency, reason, changed_by)
    values (new.service_type, new.scope,
            case when tg_op = 'UPDATE' then old.amount_cents end,
            new.amount_cents, new.currency,
            nullif(current_setting('app.price_reason', true), ''), auth.uid());
  end if;
  return null;
end;
$$;

-- Most specific matching price wins: pkg:<slug> -> kind:<last slug segment> -> '*'.
create function public.resolve_price(p_service_type text, p_package_slug text default null)
returns int
language sql stable set search_path = '' as $$
  select amount_cents
    from public.service_prices
   where service_type = p_service_type
     and scope in (
       '*',
       'pkg:' || coalesce(p_package_slug, ''),
       'kind:' || coalesce(substring(p_package_slug from '[^/]+$'), '')
     )
   order by case when scope like 'pkg:%' then 1 when scope like 'kind:%' then 2 else 3 end
   limit 1
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create trigger clients_set_updated_at before update on public.clients
  for each row execute function public.set_updated_at();

create trigger sr_before_write before insert or update on public.service_requests
  for each row execute function public.service_requests_before_write();
create trigger sr_log_changes after insert or update on public.service_requests
  for each row execute function public.log_request_changes();

create trigger re_touch_request after insert on public.request_events
  for each row execute function public.touch_request_on_event();

create trigger staff_guard before update or delete on public.staff_profiles
  for each row execute function public.staff_profiles_guard();

create trigger sp_stamp before insert or update on public.service_prices
  for each row execute function public.service_prices_stamp();
create trigger sp_history after insert or update on public.service_prices
  for each row execute function public.log_price_change();

-- ---------------------------------------------------------------------------
-- Privileges & Row Level Security (default deny; nothing for anon)
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon, public;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant usage on sequence public.request_ref_seq to authenticated;
grant execute on function public.staff_role() to authenticated;
grant execute on function public.resolve_price(text, text) to authenticated;

alter table public.staff_profiles        enable row level security;
alter table public.request_statuses      enable row level security;
alter table public.clients               enable row level security;
alter table public.service_requests      enable row level security;
alter table public.service_prices        enable row level security;
alter table public.service_price_history enable row level security;
alter table public.request_events        enable row level security;

-- staff_profiles
create policy staff_select on public.staff_profiles for select to authenticated
  using (id = auth.uid() or public.staff_role() is not null);
create policy staff_insert on public.staff_profiles for insert to authenticated
  with check (public.staff_role() = 'admin');
create policy staff_update on public.staff_profiles for update to authenticated
  using (public.staff_role() = 'admin' or (id = auth.uid() and public.staff_role() is not null))
  with check (public.staff_role() = 'admin' or (id = auth.uid() and public.staff_role() is not null));
create policy staff_delete on public.staff_profiles for delete to authenticated
  using (public.staff_role() = 'admin');

-- request_statuses
create policy statuses_select on public.request_statuses for select to authenticated
  using (public.staff_role() is not null);
create policy statuses_insert on public.request_statuses for insert to authenticated
  with check (public.staff_role() = 'admin');
create policy statuses_update on public.request_statuses for update to authenticated
  using (public.staff_role() = 'admin') with check (public.staff_role() = 'admin');
create policy statuses_delete on public.request_statuses for delete to authenticated
  using (public.staff_role() = 'admin');

-- service_prices (no delete) and its history (read-only for everyone; written by trigger)
create policy prices_select on public.service_prices for select to authenticated
  using (public.staff_role() is not null);
create policy prices_insert on public.service_prices for insert to authenticated
  with check (public.staff_role() = 'admin');
create policy prices_update on public.service_prices for update to authenticated
  using (public.staff_role() = 'admin') with check (public.staff_role() = 'admin');
create policy price_history_select on public.service_price_history for select to authenticated
  using (public.staff_role() is not null);

-- clients (mentor access arrives with Phase 3)
create policy clients_select on public.clients for select to authenticated
  using (public.staff_role() in ('admin', 'agent', 'viewer'));
create policy clients_insert on public.clients for insert to authenticated
  with check (public.staff_role() in ('admin', 'agent'));
create policy clients_update on public.clients for update to authenticated
  using (public.staff_role() in ('admin', 'agent')) with check (public.staff_role() in ('admin', 'agent'));
create policy clients_delete on public.clients for delete to authenticated
  using (public.staff_role() = 'admin');

-- service_requests
create policy sr_select on public.service_requests for select to authenticated
  using (public.staff_role() in ('admin', 'agent', 'viewer'));
create policy sr_insert on public.service_requests for insert to authenticated
  with check (public.staff_role() in ('admin', 'agent'));
create policy sr_update on public.service_requests for update to authenticated
  using (public.staff_role() in ('admin', 'agent')) with check (public.staff_role() in ('admin', 'agent'));
create policy sr_delete on public.service_requests for delete to authenticated
  using (public.staff_role() = 'admin');

-- request_events: append-only; staff may add notes/contacts/field changes, the rest comes from triggers
create policy re_select on public.request_events for select to authenticated
  using (exists (select 1 from public.service_requests r where r.id = request_id));
create policy re_insert on public.request_events for insert to authenticated
  with check (
    public.staff_role() in ('admin', 'agent')
    and actor_id = auth.uid()
    and type in ('note', 'contact_attempt', 'field_change')
  );
revoke update, delete on public.request_events from authenticated;
revoke update, delete on public.service_price_history from authenticated;
revoke insert on public.service_price_history from authenticated;
revoke delete on public.service_prices from authenticated;
