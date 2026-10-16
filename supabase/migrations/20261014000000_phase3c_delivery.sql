-- Phase 3C: mentor assignment, mentor-scoped access (RLS), delivery checklist.

alter table public.service_requests
  add column mentor_id uuid references public.staff_profiles (id),
  add column delivery_checklist jsonb not null default '{}';
create index sr_mentor_idx on public.service_requests (mentor_id) where mentor_id is not null;

-- Is this request assigned to the signed-in mentor? (security definer: usable inside policies without recursion)
create function public.is_my_request(p_request_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.service_requests r
                  where r.id = p_request_id and r.mentor_id = auth.uid())
     and public.staff_role() = 'mentor'
$$;
revoke all on function public.is_my_request(uuid) from public, anon;
grant execute on function public.is_my_request(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Policies: a mentor sees and works on their own requests only
-- ---------------------------------------------------------------------------

create policy sr_mentor_select on public.service_requests for select to authenticated
  using (public.staff_role() = 'mentor' and mentor_id = auth.uid());
create policy sr_mentor_update on public.service_requests for update to authenticated
  using (public.staff_role() = 'mentor' and mentor_id = auth.uid())
  with check (public.staff_role() = 'mentor' and mentor_id = auth.uid());

create policy clients_mentor_select on public.clients for select to authenticated
  using (public.staff_role() = 'mentor'
         and exists (select 1 from public.service_requests r where r.client_id = clients.id and r.mentor_id = auth.uid()));

-- Events: a mentor sees their requests' history (never payments) and may add notes and checklist ticks (not other field changes).
-- (request_events reads: phase3a's re_select already keeps payments and agreed-price entries away from mentors.)

drop policy re_insert on public.request_events;
create policy re_insert on public.request_events for insert to authenticated
  with check (
    actor_id = auth.uid()
    and (
      (public.staff_role() in ('admin', 'agent') and type in ('note', 'contact_attempt', 'field_change'))
      or (public.staff_role() = 'mentor' and public.is_my_request(request_id)
          and (type = 'note' or (type = 'field_change' and metadata->>'field' = 'checklist')))
    )
  );

-- Documents: mentors read the documents of their requests and add deliverables.
drop policy documents_select on public.request_documents;
create policy documents_select on public.request_documents for select to authenticated
  using (public.staff_role() in ('admin', 'agent') or public.is_my_request(request_id));
drop policy documents_insert on public.request_documents;
create policy documents_insert on public.request_documents for insert to authenticated
  with check (
    uploaded_by = auth.uid()
    and (public.staff_role() in ('admin', 'agent')
         or (public.is_my_request(request_id) and kind in ('deliverable', 'other')))
  );

-- Is this Storage object under request/<id>/ for a request assigned to the signed-in mentor? (Malformed names are simply false.)
create function public.is_my_request_object(p_name text) returns boolean
language sql stable set search_path = '' as $$
  select public.is_my_request(case when p_name ~ '^request/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/' then substr(p_name, 9, 36)::uuid end)
$$;
revoke all on function public.is_my_request_object(text) from public, anon;
grant execute on function public.is_my_request_object(text) to authenticated;

drop policy request_docs_upload on storage.objects;
create policy request_docs_upload on storage.objects for insert to authenticated
  with check (
    bucket_id = 'request-docs' and name like 'request/%'
    and (public.staff_role() in ('admin', 'agent') or public.is_my_request_object(name))
  );

-- The Storage API uploads with INSERT ... RETURNING and cleans up with DELETE ... WHERE, both of which also pass the
-- SELECT policies (see phase 3B): a mentor gets the same own-object rules as staff, scoped to their requests.
drop policy request_docs_read_own_pending on storage.objects;
create policy request_docs_read_own_pending on storage.objects for select to authenticated
  using (bucket_id = 'request-docs' and owner = auth.uid()
         and (public.staff_role() in ('admin', 'agent') or public.is_my_request_object(name)));
drop policy request_docs_cleanup on storage.objects;
create policy request_docs_cleanup on storage.objects for delete to authenticated
  using (bucket_id = 'request-docs'
         and (public.staff_role() in ('admin', 'agent') or (owner = auth.uid() and public.is_my_request_object(name)))
         and not exists (select 1 from public.request_documents d where d.storage_path = name));

-- ---------------------------------------------------------------------------
-- What a mentor may change: delivery status and checklist (nothing else)
-- ---------------------------------------------------------------------------

create function public.mentor_update_guard() returns trigger
language plpgsql set search_path = '' as $$
declare
  -- updated_at / last_activity_at are stamped by triggers (including the one fired by a timeline event).
  keep text[] := array['status', 'delivery_checklist', 'updated_at', 'last_activity_at'];
begin
  if auth.uid() is not null and public.staff_role() = 'mentor' then
    -- A status move may carry its own reason (the app clears it); otherwise the reason is as locked as everything else.
    if new.status is distinct from old.status then
      keep := array_append(keep, 'status_reason');
    end if;
    if (to_jsonb(new) - keep) is distinct from (to_jsonb(old) - keep) then
      raise exception 'Mentors may only update the delivery status and checklist' using errcode = '42501';
    end if;
    if new.status is distinct from old.status
       and not (old.status in ('deposit_paid', 'paid', 'in_progress', 'completed') and new.status in ('in_progress', 'completed')) then
      raise exception 'Mentors may only move delivery statuses' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.mentor_update_guard() from public, anon;
-- Named to sort before sr_before_write: triggers fire alphabetically, and the guard must refuse first.
create trigger sr_a_mentor_guard before update on public.service_requests
  for each row execute function public.mentor_update_guard();

-- Log mentor (re)assignment on the timeline.
create or replace function public.log_request_changes() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.request_events (request_id, type, to_status, actor_id, metadata)
    values (new.id, 'created', new.status, auth.uid(), jsonb_build_object('source', new.source));
    if new.assigned_to is not null then
      insert into public.request_events (request_id, type, actor_id, metadata)
      values (new.id, 'assignment', auth.uid(), jsonb_build_object('from', null, 'to', new.assigned_to));
    end if;
    return null;
  end if;

  if new.status is distinct from old.status then
    insert into public.request_events (request_id, type, from_status, to_status, body, actor_id, metadata)
    values (new.id, 'status_change', old.status, new.status, new.status_reason, auth.uid(),
            case when new.lost_reason is not null then jsonb_build_object('lost_reason', new.lost_reason) else '{}'::jsonb end);
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.id, 'assignment', null, auth.uid(), jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;

  if new.mentor_id is distinct from old.mentor_id then
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.id, 'assignment', null, auth.uid(),
            jsonb_build_object('role', 'mentor', 'from', old.mentor_id, 'to', new.mentor_id));
  end if;
  return null;
end;
$$;

-- Tick / untick a delivery step and log it on the timeline in one transaction. Runs as the caller, so RLS and the mentor
-- guard apply; returns false when the request changed since p_expected_updated_at (or is not visible to the caller).
create function public.set_delivery_checklist(p_id uuid, p_expected_updated_at timestamptz, p_checklist jsonb, p_key text, p_done boolean, p_label text)
returns boolean
language plpgsql set search_path = '' as $$
begin
  update public.service_requests set delivery_checklist = p_checklist
   where id = p_id and updated_at = p_expected_updated_at;
  if not found then
    return false;
  end if;
  insert into public.request_events (request_id, type, body, actor_id, metadata)
  values (p_id, 'field_change', p_label, auth.uid(), jsonb_build_object('field', 'checklist', 'item', p_key, 'done', p_done));
  return true;
end;
$$;
revoke all on function public.set_delivery_checklist(uuid, timestamptz, jsonb, text, boolean, text) from public, anon;
grant execute on function public.set_delivery_checklist(uuid, timestamptz, jsonb, text, boolean, text) to authenticated;
