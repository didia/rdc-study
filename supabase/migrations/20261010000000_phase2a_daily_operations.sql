-- Phase 2A: lost reasons, message templates, saved views, audit events.

-- ---------------------------------------------------------------------------
-- Lost reasons
-- ---------------------------------------------------------------------------

create table public.lost_reasons (
  code        text primary key,
  label_fr    text not null,
  sort_order  int not null,
  is_active   boolean not null default true
);

insert into public.lost_reasons (code, label_fr, sort_order) values
  ('no_response',            'Sans réponse du client',        10),
  ('too_expensive',          'Trop cher',                     20),
  ('chose_competitor',       'A choisi un autre prestataire', 30),
  ('not_eligible',           'Non éligible',                  40),
  ('changed_plans',          'A changé de projet',            50),
  ('visa_refused_elsewhere', 'Visa refusé (ailleurs)',        60),
  ('duplicate',              'Doublon',                       70),
  ('other',                  'Autre',                         80);

alter table public.service_requests add column lost_reason text references public.lost_reasons (code);

-- Leaving a lost status clears the reason; the status_change event records it when entering one.
create or replace function public.service_requests_before_write() returns trigger
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
      new.lost_reason = null;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.log_request_changes() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.request_events (request_id, type, to_status, actor_id, metadata)
    values (new.id, 'created', new.status, auth.uid(), jsonb_build_object('source', new.source));
    return null;
  end if;

  if new.status is distinct from old.status then
    insert into public.request_events (request_id, type, from_status, to_status, body, actor_id, metadata)
    values (new.id, 'status_change', old.status, new.status, new.status_reason, auth.uid(),
            case when new.lost_reason is not null then jsonb_build_object('lost_reason', new.lost_reason) else '{}'::jsonb end);
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.id, 'assignment', null, auth.uid(),
            jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;
  return null;
end;
$$;

-- ---------------------------------------------------------------------------
-- Message templates (WhatsApp / email)
-- ---------------------------------------------------------------------------

create table public.message_templates (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  label       text not null,
  channel     text not null check (channel in ('whatsapp', 'email')),
  body_fr     text not null,
  sort_order  int not null default 100,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

create trigger message_templates_set_updated_at before update on public.message_templates
  for each row execute function public.set_updated_at();

insert into public.message_templates (code, label, channel, body_fr, sort_order) values
  ('first_contact', 'Premier contact', 'whatsapp',
   E'Bonjour {{first_name}}, c''est {{staff_name}} de RDC Études. Nous avons bien reçu votre demande ({{reference}}) concernant {{package}}. Quand seriez-vous disponible pour en parler ?', 10),
  ('reminder', 'Relance', 'whatsapp',
   E'Bonjour {{first_name}}, je reviens vers vous au sujet de votre demande {{reference}} ({{package}}). Êtes-vous toujours intéressé(e) ? Dites-moi si vous avez des questions.', 20),
  ('payment_instructions', 'Instructions de paiement', 'whatsapp',
   E'Bonjour {{first_name}}, pour démarrer votre accompagnement ({{package}}), voici comment régler : {{payment_instructions}} Merci d''indiquer la référence {{reference}} et de m''envoyer la preuve de paiement.', 30),
  ('documents_needed', 'Documents à fournir', 'whatsapp',
   E'Bonjour {{first_name}}, pour avancer sur votre dossier ({{package}}), pouvez-vous m''envoyer vos documents (pièce d''identité, diplômes, relevés de notes) ? Merci !', 40),
  ('closing', 'Clôture', 'whatsapp',
   E'Bonjour {{first_name}}, sans nouvelle de votre part, je clôture votre demande {{reference}} pour le moment. N''hésitez pas à nous réécrire quand vous serez prêt(e). — {{staff_name}}, RDC Études', 50),
  ('first_contact_email', 'Premier contact (e-mail)', 'email',
   E'Bonjour {{first_name}},\n\nNous avons bien reçu votre demande ({{reference}}) concernant {{package}}. Seriez-vous disponible pour en parler ?\n\nCordialement,\n{{staff_name}}\nRDC Études', 60);

-- ---------------------------------------------------------------------------
-- Saved views (per-user list filters, optionally shared)
-- ---------------------------------------------------------------------------

create table public.saved_views (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.staff_profiles (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  params      jsonb not null,
  shared      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index saved_views_owner_idx on public.saved_views (owner_id);

-- ---------------------------------------------------------------------------
-- Audit events (exports now; audit log viewer in Phase 4). Append-only.
-- ---------------------------------------------------------------------------

create table public.audit_events (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.staff_profiles (id),
  type        text not null,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index audit_events_created_idx on public.audit_events (created_at desc);

-- ---------------------------------------------------------------------------
-- Privileges & RLS
-- ---------------------------------------------------------------------------

revoke all on public.lost_reasons, public.message_templates, public.saved_views, public.audit_events from anon;
grant select, insert, update, delete on public.lost_reasons, public.message_templates, public.saved_views, public.audit_events to authenticated;
grant all on public.lost_reasons, public.message_templates, public.saved_views, public.audit_events to service_role;
revoke update, delete on public.audit_events from authenticated;

alter table public.lost_reasons      enable row level security;
alter table public.message_templates enable row level security;
alter table public.saved_views       enable row level security;
alter table public.audit_events      enable row level security;

create policy lost_reasons_select on public.lost_reasons for select to authenticated using (public.staff_role() is not null);
create policy lost_reasons_write on public.lost_reasons for all to authenticated
  using (public.staff_role() = 'admin') with check (public.staff_role() = 'admin');

create policy templates_select on public.message_templates for select to authenticated using (public.staff_role() is not null);
create policy templates_write on public.message_templates for all to authenticated
  using (public.staff_role() = 'admin') with check (public.staff_role() = 'admin');

create policy views_select on public.saved_views for select to authenticated
  using (public.staff_role() is not null and (owner_id = auth.uid() or shared));
create policy views_insert on public.saved_views for insert to authenticated
  with check (public.staff_role() is not null and owner_id = auth.uid());
create policy views_update on public.saved_views for update to authenticated
  using (public.staff_role() is not null and owner_id = auth.uid())
  with check (owner_id = auth.uid());
create policy views_delete on public.saved_views for delete to authenticated
  using (public.staff_role() is not null and owner_id = auth.uid());

create policy audit_select on public.audit_events for select to authenticated using (public.staff_role() = 'admin');
create policy audit_insert on public.audit_events for insert to authenticated
  with check (public.staff_role() in ('admin', 'agent') and actor_id = auth.uid());
