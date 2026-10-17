-- Phase 4C: data lifecycle — retention (anonymisation) and subject-access tooling.

alter table public.clients add column anonymised_at timestamptz;

insert into public.app_settings (key, value) values
  ('retention_months', '24'::jsonb),
  ('retention_auto', 'false'::jsonb);

-- Payments stay immutable, with one exception: anonymisation may blank the free-text fields (note, reference, void reason).
create or replace function public.payments_guard() returns trigger
language plpgsql set search_path = '' as $$
declare
  net bigint;
begin
  if tg_op = 'INSERT' then
    new.recorded_by = coalesce(new.recorded_by, auth.uid());
    new.voided_at = null; new.voided_by = null; new.void_reason = null;
    if new.kind = 'refund' then
      -- The request row lock serialises refunds and voids, so two concurrent ones cannot both pass the check.
      perform 1 from public.service_requests where id = new.request_id for update;
      select coalesce(sum(case when kind = 'refund' then -amount_cents else amount_cents end), 0) into net
        from public.payments where request_id = new.request_id and currency = new.currency and voided_at is null;
      if new.amount_cents > net then
        raise exception 'A refund cannot exceed the net amount received in this currency' using errcode = 'P0001';
      end if;
    end if;
    return new;
  end if;
  -- Anonymisation may blank the free-text fields (note, reference, void reason), nothing else.
  if current_setting('app.anonymising', true) = 'on'
     and (to_jsonb(new) - 'note' - 'external_ref' - 'void_reason') is not distinct from (to_jsonb(old) - 'note' - 'external_ref' - 'void_reason') then
    return new;
  end if;
  -- UPDATE: the only allowed change is voiding a live payment.
  if old.voided_at is not null
     or new.voided_at is null
     or coalesce(trim(new.void_reason), '') = ''
     or (to_jsonb(new) - 'voided_at' - 'voided_by' - 'void_reason')
        is distinct from (to_jsonb(old) - 'voided_at' - 'voided_by' - 'void_reason') then
    raise exception 'Payments are immutable: only a void (with a reason) is allowed' using errcode = 'P0001';
  end if;
  if old.kind <> 'refund' then
    -- Voiding money that a refund already counts on would leave a negative balance: void the refund first.
    perform 1 from public.service_requests where id = old.request_id for update;
    select coalesce(sum(case when kind = 'refund' then -amount_cents else amount_cents end), 0) into net
      from public.payments where request_id = old.request_id and currency = old.currency and voided_at is null and id <> old.id;
    if net < 0 then
      raise exception 'Void the refunds recorded after this payment first' using errcode = 'P0001';
    end if;
  end if;
  new.voided_at = now();
  new.voided_by = coalesce(auth.uid(), new.voided_by);
  return new;
end;
$$;

-- An anonymisation update is not a void: it must not write a "voided" timeline entry.
create or replace function public.log_payment() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.request_id, 'payment', new.note, auth.uid(),
            jsonb_build_object('action', 'recorded', 'payment_id', new.id, 'kind', new.kind,
                               'amount_cents', new.amount_cents, 'currency', new.currency, 'method', new.method));
  elsif current_setting('app.anonymising', true) is distinct from 'on' then
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.request_id, 'payment', new.void_reason, auth.uid(),
            jsonb_build_object('action', 'voided', 'payment_id', new.id, 'kind', new.kind,
                               'amount_cents', new.amount_cents, 'currency', new.currency, 'method', new.method));
  end if;
  return null;
end;
$$;

-- `anonymised_at` and the identity fields of an anonymised client change through anonymise_client() only:
-- otherwise an agent could mark a client as done without the wipe, or write personal data back afterwards.
create function public.clients_anonymised_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_setting('app.anonymising', true) = 'on' then
    return new;
  end if;
  if new.anonymised_at is distinct from old.anonymised_at then
    raise exception 'anonymised_at is set by anonymisation only' using errcode = 'P0001';
  end if;
  if old.anonymised_at is not null
     and (new.first_name, new.last_name, new.email, new.phone, new.phone_e164, new.address, new.notes, new.preferred_channel)
         is distinct from
         (old.first_name, old.last_name, old.email, old.phone, old.phone_e164, old.address, old.notes, old.preferred_channel) then
    raise exception 'An anonymised client cannot hold personal data again' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger clients_anonymised_guard before update on public.clients
  for each row execute function public.clients_anonymised_guard();

-- A signed-in user cannot choose when a request closed (retention counts from it): it is set when the status
-- moves to a closed one. Fires after sr_before_write (trigger names fire in alphabetical order).
create function public.sr_closed_at_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null and new.closed_at is not null then
    new.closed_at = case when new.status is distinct from old.status then coalesce(old.closed_at, now()) else old.closed_at end;
  end if;
  return new;
end;
$$;
create trigger sr_closed_at_guard before update on public.service_requests
  for each row when (old.closed_at is distinct from new.closed_at)
  execute function public.sr_closed_at_guard();

-- Storage paths of deleted documents wait here, in the same transaction that deletes the rows, until the
-- file is really gone from the bucket: a failed or interrupted delete is retried by the next sweep.
create table public.storage_delete_queue (
  path text primary key,
  queued_at timestamptz not null default now()
);
alter table public.storage_delete_queue enable row level security;
revoke all on public.storage_delete_queue from public, anon, authenticated;

create function public.fn_storage_delete_queue() returns text[]
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and public.staff_role() is distinct from 'admin' then
    raise exception 'Only an admin can read the deletion queue' using errcode = '42501';
  end if;
  return coalesce((select array_agg(q.path order by q.queued_at) from public.storage_delete_queue q), '{}');
end;
$$;

create function public.ack_storage_deletes(p_paths text[]) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and public.staff_role() is distinct from 'admin' then
    raise exception 'Only an admin can clear the deletion queue' using errcode = '42501';
  end if;
  delete from public.storage_delete_queue where path = any(p_paths);
end;
$$;

-- Clients with nothing left open and no request closed for longer than p_months (lost stage or completed),
-- plus clients that never had a request and are older than that. Not yet anonymised.
create function public.fn_retention_candidates(p_months int)
returns table (client_id uuid, first_name text, last_name text, requests int, last_closed_at timestamptz, request_refs text[])
language plpgsql stable set search_path = '' as $$
#variable_conflict use_column
begin
  if auth.uid() is not null and public.staff_role() is distinct from 'admin' then
    raise exception 'Only an admin can list retention candidates' using errcode = '42501';
  end if;
  return query
  select c.id, c.first_name, c.last_name, count(r.id)::int, coalesce(max(r.closed_at), c.created_at),
         coalesce(array_agg(r.reference order by r.submitted_at) filter (where r.id is not null), '{}')
    from public.clients c
    left join public.service_requests r on r.client_id = c.id
    left join public.request_statuses s on s.code = r.status
   where c.anonymised_at is null
   group by c.id
  having bool_and(r.id is null or (r.closed_at is not null and (s.stage = 'lost' or r.status = 'completed')))
     and coalesce(max(r.closed_at), c.created_at) < now() - make_interval(months => greatest(p_months, 1));
end;
$$;

-- Clears personal data of one client and queues the storage paths of their documents for deletion (rows are
-- removed now, the caller deletes the files and acknowledges). Amounts and dates stay for accounting and for the
-- dashboard totals. A retention run re-checks, under the client lock, that nothing is open: a request that arrived
-- since the candidate list was read is never wiped.
create function public.anonymise_client(p_client uuid, p_reason text default 'retention')
returns text[]
language plpgsql security definer set search_path = '' as $$
declare
  paths text[];
  done_at timestamptz;
begin
  if auth.uid() is not null and public.staff_role() is distinct from 'admin' then
    raise exception 'Only an admin can anonymise a client' using errcode = '42501';
  end if;
  select anonymised_at into done_at from public.clients where id = p_client for update;
  if not found then
    raise exception 'Client not found' using errcode = 'P0002';
  end if;
  if done_at is not null then
    return '{}';
  end if;
  if p_reason like 'retention%' and exists (
       select 1 from public.service_requests r left join public.request_statuses s on s.code = r.status
        where r.client_id = p_client and not (r.closed_at is not null and (s.stage = 'lost' or r.status = 'completed'))) then
    raise exception 'This client has an open request' using errcode = 'P0001';
  end if;

  select coalesce(array_agg(d.storage_path), '{}') into paths
    from public.request_documents d join public.service_requests r on r.id = d.request_id
   where r.client_id = p_client;
  insert into public.storage_delete_queue (path) select unnest(paths) on conflict do nothing;
  delete from public.request_documents d using public.service_requests r
   where r.id = d.request_id and r.client_id = p_client;

  perform set_config('app.anonymising', 'on', true);
  update public.payments p set note = null, external_ref = null,
         void_reason = case when p.void_reason is not null then 'anonymised' end
    from public.service_requests r where r.id = p.request_id and r.client_id = p_client;
  update public.clients set first_name = 'Anonymisé', last_name = 'Anonymisé', email = null, phone = null,
         phone_e164 = null, address = null, notes = null, preferred_channel = null, anonymised_at = now()
   where id = p_client;
  perform set_config('app.anonymising', 'off', true);

  update public.request_events e set body = null
    from public.service_requests r
   where r.id = e.request_id and r.client_id = p_client and e.type <> 'created';
  update public.service_requests set original_message = null, source_url = null,
         form_answers = '{}'::jsonb, status_reason = null, idempotency_key = null
   where client_id = p_client;
  -- A merge records the name of the client that was merged away.
  update public.audit_events set metadata = metadata - 'dropped_name'
   where type = 'merge_clients' and (metadata->>'kept' = p_client::text or metadata->>'dropped' = p_client::text);

  insert into public.audit_events (actor_id, type, metadata)
  values (auth.uid(), 'anonymise_client', jsonb_build_object('client_id', p_client, 'reason', p_reason, 'documents', coalesce(array_length(paths, 1), 0)));
  return paths;
end;
$$;

-- One client's data as JSON (subject access request). Admin only; every export is recorded here, whatever the caller.
create function public.fn_client_export(p_client uuid)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  result jsonb;
begin
  if auth.uid() is not null and public.staff_role() is distinct from 'admin' then
    raise exception 'Only an admin can export a client' using errcode = '42501';
  end if;
  if not exists (select 1 from public.clients where id = p_client) then
    return null;
  end if;
  result := jsonb_build_object(
    'client', (select to_jsonb(c) from public.clients c where c.id = p_client),
    'requests', coalesce((select jsonb_agg(to_jsonb(r) order by r.submitted_at) from public.service_requests r where r.client_id = p_client), '[]'::jsonb),
    'events', coalesce((select jsonb_agg(to_jsonb(e) order by e.created_at) from public.request_events e
                         join public.service_requests r on r.id = e.request_id where r.client_id = p_client), '[]'::jsonb),
    'payments', coalesce((select jsonb_agg(to_jsonb(p) order by p.paid_at) from public.payments p
                           join public.service_requests r on r.id = p.request_id where r.client_id = p_client), '[]'::jsonb),
    'documents', coalesce((select jsonb_agg(jsonb_build_object('file_name', d.file_name, 'kind', d.kind, 'created_at', d.created_at, 'storage_path', d.storage_path) order by d.created_at)
                            from public.request_documents d join public.service_requests r on r.id = d.request_id where r.client_id = p_client), '[]'::jsonb),
    'exported_at', now()
  );
  insert into public.audit_events (actor_id, type, metadata) values (auth.uid(), 'export_client', jsonb_build_object('client_id', p_client));
  return result;
end;
$$;

revoke all on function public.fn_retention_candidates(int), public.anonymise_client(uuid, text), public.fn_client_export(uuid),
  public.fn_storage_delete_queue(), public.ack_storage_deletes(text[]) from public, anon;
grant execute on function public.fn_retention_candidates(int), public.anonymise_client(uuid, text), public.fn_client_export(uuid),
  public.fn_storage_delete_queue(), public.ack_storage_deletes(text[]) to authenticated, service_role;
revoke all on function public.clients_anonymised_guard(), public.sr_closed_at_guard() from public, anon;
