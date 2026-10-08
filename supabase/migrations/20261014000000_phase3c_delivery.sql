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

-- Events: staff as before; a mentor sees their requests' history but never payments.
drop policy re_select on public.request_events;
create policy re_select on public.request_events for select to authenticated
  using (exists (select 1 from public.service_requests r where r.id = request_id)
         and (public.staff_role() <> 'mentor' or type <> 'payment'));

drop policy re_insert on public.request_events;
create policy re_insert on public.request_events for insert to authenticated
  with check (
    actor_id = auth.uid()
    and (
      (public.staff_role() in ('admin', 'agent') and type in ('note', 'contact_attempt', 'field_change'))
      or (public.staff_role() = 'mentor' and type in ('note', 'field_change') and public.is_my_request(request_id))
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

drop policy request_docs_upload on storage.objects;
create policy request_docs_upload on storage.objects for insert to authenticated
  with check (
    bucket_id = 'request-docs' and name like 'request/%'
    and (public.staff_role() in ('admin', 'agent')
         or (public.staff_role() = 'mentor' and public.is_my_request(((storage.foldername(name))[2])::uuid)))
  );

-- ---------------------------------------------------------------------------
-- What a mentor may change: delivery status and checklist (nothing else)
-- ---------------------------------------------------------------------------

create function public.mentor_update_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null and public.staff_role() = 'mentor' then
    if (to_jsonb(new) - 'status' - 'status_reason' - 'delivery_checklist' - 'updated_at' - 'last_activity_at' - 'closed_at' - 'next_follow_up_at')
       is distinct from
       (to_jsonb(old) - 'status' - 'status_reason' - 'delivery_checklist' - 'updated_at' - 'last_activity_at' - 'closed_at' - 'next_follow_up_at') then
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
create trigger sr_mentor_guard before update on public.service_requests
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
