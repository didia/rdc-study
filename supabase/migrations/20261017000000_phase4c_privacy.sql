-- Phase 4C: data lifecycle — retention (anonymisation) and subject-access tooling.

alter table public.clients add column anonymised_at timestamptz;

insert into public.app_settings (key, value) values
  ('retention_months', '24'::jsonb),
  ('retention_auto', 'false'::jsonb);

-- Payments stay immutable, with one exception: anonymisation may blank the free-text fields (note, reference).
create or replace function public.payments_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.recorded_by = coalesce(new.recorded_by, auth.uid());
    new.voided_at = null; new.voided_by = null; new.void_reason = null;
    return new;
  end if;
  if current_setting('app.anonymising', true) = 'on'
     and (to_jsonb(new) - 'note' - 'external_ref') is not distinct from (to_jsonb(old) - 'note' - 'external_ref') then
    return new;
  end if;
  if old.voided_at is not null
     or new.voided_at is null
     or coalesce(trim(new.void_reason), '') = ''
     or (to_jsonb(new) - 'voided_at' - 'voided_by' - 'void_reason')
        is distinct from (to_jsonb(old) - 'voided_at' - 'voided_by' - 'void_reason') then
    raise exception 'Payments are immutable: only a void (with a reason) is allowed' using errcode = 'P0001';
  end if;
  new.voided_by = coalesce(auth.uid(), new.voided_by);
  return new;
end;
$$;

-- Clients whose requests are ALL closed (lost or completed) for longer than p_months, not yet anonymised.
create function public.fn_retention_candidates(p_months int)
returns table (client_id uuid, requests int, last_closed_at timestamptz)
language sql stable set search_path = '' as $$
  select c.id, count(r.id)::int, max(r.closed_at)
    from public.clients c
    join public.service_requests r on r.client_id = c.id
   where c.anonymised_at is null
   group by c.id
  having bool_and(r.closed_at is not null)
     and max(r.closed_at) < now() - make_interval(months => greatest(p_months, 1))
$$;

-- Clears personal data of one client and returns the storage paths of their documents (rows are removed,
-- the caller deletes the files). Amounts and dates stay for accounting and for the dashboard totals.
create function public.anonymise_client(p_client uuid, p_reason text default 'retention')
returns text[]
language plpgsql security definer set search_path = '' as $$
declare
  paths text[];
begin
  if auth.uid() is not null and public.staff_role() is distinct from 'admin' then
    raise exception 'Only an admin can anonymise a client' using errcode = '42501';
  end if;
  if not exists (select 1 from public.clients where id = p_client) then
    raise exception 'Client not found' using errcode = 'P0002';
  end if;

  select coalesce(array_agg(d.storage_path), '{}') into paths
    from public.request_documents d join public.service_requests r on r.id = d.request_id
   where r.client_id = p_client;
  delete from public.request_documents d using public.service_requests r
   where r.id = d.request_id and r.client_id = p_client;

  perform set_config('app.anonymising', 'on', true);
  update public.payments p set note = null, external_ref = null
    from public.service_requests r where r.id = p.request_id and r.client_id = p_client;
  perform set_config('app.anonymising', 'off', true);
  update public.request_events e set body = null,
         metadata = e.metadata - 'dropped_name'
    from public.service_requests r
   where r.id = e.request_id and r.client_id = p_client and e.type <> 'created';
  update public.service_requests set original_message = null, source_url = null,
         form_answers = '{}'::jsonb, status_reason = null, idempotency_key = null
   where client_id = p_client;
  update public.clients set first_name = 'Anonymisé', last_name = 'Anonymisé', email = null, phone = null,
         phone_e164 = null, address = null, notes = null, anonymised_at = now()
   where id = p_client;

  insert into public.audit_events (actor_id, type, metadata)
  values (auth.uid(), 'anonymise_client', jsonb_build_object('client_id', p_client, 'reason', p_reason, 'documents', coalesce(array_length(paths, 1), 0)));
  return paths;
end;
$$;

-- One client's data as JSON (subject access request). Security invoker: admin RLS applies.
create function public.fn_client_export(p_client uuid)
returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'client', (select to_jsonb(c) from public.clients c where c.id = p_client),
    'requests', coalesce((select jsonb_agg(to_jsonb(r) order by r.submitted_at) from public.service_requests r where r.client_id = p_client), '[]'::jsonb),
    'events', coalesce((select jsonb_agg(to_jsonb(e) order by e.created_at) from public.request_events e
                         join public.service_requests r on r.id = e.request_id where r.client_id = p_client), '[]'::jsonb),
    'payments', coalesce((select jsonb_agg(to_jsonb(p) order by p.paid_at) from public.payments p
                           join public.service_requests r on r.id = p.request_id where r.client_id = p_client), '[]'::jsonb),
    'documents', coalesce((select jsonb_agg(jsonb_build_object('file_name', d.file_name, 'kind', d.kind, 'created_at', d.created_at) order by d.created_at)
                            from public.request_documents d join public.service_requests r on r.id = d.request_id where r.client_id = p_client), '[]'::jsonb),
    'exported_at', now()
  )
$$;

revoke all on function public.fn_retention_candidates(int), public.anonymise_client(uuid, text), public.fn_client_export(uuid) from public, anon;
grant execute on function public.fn_retention_candidates(int), public.anonymise_client(uuid, text), public.fn_client_export(uuid) to authenticated;
grant execute on function public.fn_retention_candidates(int), public.anonymise_client(uuid, text), public.fn_client_export(uuid) to service_role;
