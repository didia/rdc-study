-- Phase 2B: settings, dashboard functions, client merge/duplicates, round-robin assignment.

-- ---------------------------------------------------------------------------
-- Settings (key/value, admin-editable)
-- ---------------------------------------------------------------------------

create table public.app_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.staff_profiles (id)
);
insert into public.app_settings (key, value) values ('round_robin_enabled', 'false'::jsonb);

revoke all on public.app_settings from anon;
grant select, insert, update, delete on public.app_settings to authenticated;
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;
create policy settings_select on public.app_settings for select to authenticated using (public.staff_role() is not null);
create policy settings_write on public.app_settings for all to authenticated
  using (public.staff_role() = 'admin') with check (public.staff_role() = 'admin');

create function public.app_settings_stamp() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;
revoke all on function public.app_settings_stamp() from public, anon;
create trigger app_settings_stamp before insert or update on public.app_settings
  for each row execute function public.app_settings_stamp();

-- ---------------------------------------------------------------------------
-- Dashboard functions (security invoker: RLS decides what the caller can count)
-- ---------------------------------------------------------------------------

-- Did the request ever reach one of these statuses (now, at creation or through a status change)?
create function public.reached_status(p_request_id uuid, p_current text, p_codes text[])
returns boolean
language sql stable set search_path = '' as $$
  select p_current = any (p_codes)
      or exists (select 1 from public.request_events e
                  where e.request_id = p_request_id and e.to_status = any (p_codes));
$$;

create function public.fn_funnel(p_from timestamptz, p_to timestamptz)
returns table (step text, ord int, n int)
language sql stable set search_path = '' as $$
  with reqs as (
    select id, status from public.service_requests where submitted_at >= p_from and submitted_at < p_to
  )
  select s.step, s.ord, count(r.id) filter (where s.step = 'submitted' or public.reached_status(r.id, r.status, s.codes))::int
    from (values
     ('submitted',        1, array[]::text[]),
     ('contacted',        2, array['contacted','in_discussion','awaiting_client','follow_up','office_visit','awaiting_payment','deposit_paid','paid','in_progress','completed']),
     ('in_discussion',    3, array['in_discussion','awaiting_client','office_visit','awaiting_payment','deposit_paid','paid','in_progress','completed']),
     ('awaiting_payment', 4, array['awaiting_payment','deposit_paid','paid','in_progress','completed']),
     ('won',              5, array['deposit_paid','paid','in_progress','completed'])
   ) as s (step, ord, codes)
    left join reqs r on true
   group by s.step, s.ord
   order by s.ord;
$$;

-- Volume and conversion (reached a "won" status) by one dimension.
create function public.fn_conversion_by(p_dimension text, p_from timestamptz, p_to timestamptz)
returns table (label text, total int, won int)
language plpgsql stable set search_path = '' as $$
declare
  expr text;
begin
  expr := case p_dimension
    when 'destination' then 'coalesce(r.destination_country, ''—'')'
    when 'package'     then 'coalesce(r.package_slug, ''—'')'
    when 'origin'      then 'coalesce(c.origin_country, ''—'')'
    when 'service'     then 'r.service_type'
    when 'source'      then 'r.source'
    when 'assignee'    then 'coalesce(sp.full_name, ''Non assignée'')'
    else null end;
  if expr is null then
    raise exception 'unknown dimension %', p_dimension using errcode = '22023';
  end if;

  return query execute format($q$
    select %s as label,
           count(*)::int as total,
           (count(*) filter (where public.reached_status(r.id, r.status,
              array['deposit_paid','paid','in_progress','completed'])))::int as won
      from public.service_requests r
      join public.clients c on c.id = r.client_id
      left join public.staff_profiles sp on sp.id = r.assigned_to
     where r.submitted_at >= $1 and r.submitted_at < $2
     group by 1
     order by 2 desc, 1
  $q$, expr) using p_from, p_to;
end;
$$;

-- Median hours to first contact (first status change out of 'new') and to a won status.
create function public.fn_speed(p_from timestamptz, p_to timestamptz)
returns table (median_hours_to_contact numeric, contacted_count int, median_hours_to_won numeric, won_count int)
language sql stable set search_path = '' as $$
  with reqs as (
    select r.id, r.submitted_at from public.service_requests r
     where r.submitted_at >= p_from and r.submitted_at < p_to
  ), contact as (
    select q.id, min(e.created_at) - q.submitted_at as delta
      from reqs q join public.request_events e on e.request_id = q.id
       and e.type = 'status_change' and e.from_status = 'new'
       and e.to_status not like 'lost%'
     group by q.id, q.submitted_at
  ), won as (
    select q.id, min(e.created_at) - q.submitted_at as delta
      from reqs q join public.request_events e on e.request_id = q.id
       and e.type = 'status_change'
       and e.to_status in ('deposit_paid','paid','in_progress','completed')
     group by q.id, q.submitted_at
  )
  select (select round((extract(epoch from percentile_cont(0.5) within group (order by delta)) / 3600)::numeric, 1) from contact),
         (select count(*)::int from contact),
         (select round((extract(epoch from percentile_cont(0.5) within group (order by delta)) / 3600)::numeric, 1) from won),
         (select count(*)::int from won);
$$;

-- Why and where leads are lost.
create function public.fn_loss_analysis(p_from timestamptz, p_to timestamptz)
returns table (kind text, label text, n int)
language sql stable set search_path = '' as $$
  with lost as (
    select r.id, r.lost_reason,
           (select e.from_status from public.request_events e
             where e.request_id = r.id and e.type = 'status_change' and e.to_status like 'lost%'
             order by e.created_at desc, e.id desc limit 1) as last_status
      from public.service_requests r
      join public.request_statuses s on s.code = r.status and s.stage = 'lost'
     where r.submitted_at >= p_from and r.submitted_at < p_to
  )
  select 'reason'::text, coalesce(lr.label_fr, 'Non renseignée'), count(*)::int
    from lost l left join public.lost_reasons lr on lr.code = l.lost_reason
   group by 2
  union all
  select 'last_status'::text, coalesce(st.label_fr, l.last_status, '—'), count(*)::int
    from lost l left join public.request_statuses st on st.code = l.last_status
   group by 2
  order by 1, 3 desc;
$$;

create function public.fn_trend(p_from timestamptz, p_to timestamptz, p_grain text)
returns table (period date, n int)
language sql stable set search_path = '' as $$
  select date_trunc(case when p_grain = 'month' then 'month' else 'week' end, r.submitted_at)::date, count(*)::int
    from public.service_requests r
   where r.submitted_at >= p_from and r.submitted_at < p_to
   group by 1 order by 1;
$$;

-- ---------------------------------------------------------------------------
-- Duplicate clients and merge
-- ---------------------------------------------------------------------------

create function public.fn_client_duplicates()
returns table (a_id uuid, b_id uuid, reason text, score real)
language sql stable set search_path = public, extensions as $$
  select a.id, b.id,
         case when a.phone_e164 is not null and a.phone_e164 = b.phone_e164 then 'phone' else 'name' end,
         similarity(a.first_name || ' ' || a.last_name, b.first_name || ' ' || b.last_name)
    from public.clients a
    join public.clients b on a.id < b.id
   where (a.phone_e164 is not null and a.phone_e164 = b.phone_e164)
      or similarity(a.first_name || ' ' || a.last_name, b.first_name || ' ' || b.last_name) >= 0.8
   order by 4 desc
   limit 200;
$$;

-- Moves every request of `p_drop` to `p_keep`, fills the blanks of `p_keep`, logs it, removes `p_drop`.
create function public.merge_clients(p_keep uuid, p_drop uuid)
returns int
language plpgsql security definer set search_path = '' as $$
declare
  moved int;
  dropped public.clients;
begin
  if public.staff_role() not in ('admin', 'agent') then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  if p_keep = p_drop then
    raise exception 'Cannot merge a client with itself' using errcode = '22023';
  end if;
  select * into dropped from public.clients where id = p_drop;
  if not found or not exists (select 1 from public.clients where id = p_keep) then
    raise exception 'Client not found' using errcode = 'P0002';
  end if;

  update public.clients k set
    email          = coalesce(k.email, dropped.email),
    phone          = coalesce(k.phone, dropped.phone),
    phone_e164     = coalesce(k.phone_e164, dropped.phone_e164),
    origin_country = coalesce(k.origin_country, dropped.origin_country),
    notes          = nullif(concat_ws(E'\n', k.notes, dropped.notes), '')
   where k.id = p_keep;
  -- The dropped email must be released first (unique), so it is cleared on the old row before the move.
  update public.clients set email = null where id = p_drop;
  update public.clients k set email = coalesce(k.email, dropped.email) where k.id = p_keep;

  insert into public.request_events (request_id, type, body, actor_id, metadata)
  select r.id, 'field_change', 'Client fusionné', auth.uid(),
         jsonb_build_object('field', 'client_id', 'from', p_drop, 'to', p_keep)
    from public.service_requests r where r.client_id = p_drop;

  update public.service_requests set client_id = p_keep where client_id = p_drop;
  get diagnostics moved = row_count;

  insert into public.audit_events (actor_id, type, metadata)
  values (auth.uid(), 'merge_clients', jsonb_build_object('kept', p_keep, 'dropped', p_drop, 'requests_moved', moved,
          'dropped_name', dropped.first_name || ' ' || dropped.last_name));

  delete from public.clients where id = p_drop;
  return moved;
end;
$$;

revoke all on function public.merge_clients(uuid, uuid), public.reached_status(uuid, text, text[]),
  public.fn_funnel(timestamptz, timestamptz), public.fn_conversion_by(text, timestamptz, timestamptz),
  public.fn_speed(timestamptz, timestamptz), public.fn_loss_analysis(timestamptz, timestamptz),
  public.fn_trend(timestamptz, timestamptz, text), public.fn_client_duplicates() from public, anon;
grant execute on function public.merge_clients(uuid, uuid), public.reached_status(uuid, text, text[]),
  public.fn_funnel(timestamptz, timestamptz), public.fn_conversion_by(text, timestamptz, timestamptz),
  public.fn_speed(timestamptz, timestamptz), public.fn_loss_analysis(timestamptz, timestamptz),
  public.fn_trend(timestamptz, timestamptz, text), public.fn_client_duplicates() to authenticated;

-- ---------------------------------------------------------------------------
-- Round-robin assignment of new website requests (off by default)
-- ---------------------------------------------------------------------------

-- Active agent with the fewest open requests (ties: fewest assigned overall, then random).
create function public.pick_assignee() returns uuid
language sql security definer set search_path = '' as $$
  select p.id
    from public.staff_profiles p
    left join public.service_requests r
           on r.assigned_to = p.id
          and r.status in (select code from public.request_statuses where stage = 'open')
   where p.active and p.role = 'agent'
   group by p.id
   order by count(r.id), random()
   limit 1;
$$;
revoke all on function public.pick_assignee() from public, anon, authenticated;
grant execute on function public.pick_assignee() to service_role;

-- Record the assignment event for requests that are created already assigned.
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
    values (new.id, 'assignment', null, auth.uid(),
            jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;
  return null;
end;
$$;

-- submit_service_request: assign when round-robin is on.
create or replace function public.submit_service_request(payload jsonb)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_key        text := nullif(payload->>'idempotencyKey', '');
  v_email      text := lower(nullif(trim(payload->>'email'), ''));
  v_service    text := payload->>'serviceType';
  v_package    text := nullif(payload->>'packageSlug', '');
  v_client_id  uuid;
  v_request    public.service_requests;
  v_quoted     int;
  v_answers    jsonb := coalesce(payload->'formAnswers', '{}'::jsonb);
  v_assignee   uuid;
begin
  if v_service is null or v_email is null then
    raise exception 'serviceType and email are required' using errcode = '22023';
  end if;

  if v_key is not null then
    select * into v_request from public.service_requests where idempotency_key = v_key;
    if found then
      return jsonb_build_object('id', v_request.id, 'reference', v_request.reference, 'duplicate', true);
    end if;
  end if;

  insert into public.clients (first_name, last_name, email, phone, phone_e164, origin_country)
  values (
    left(coalesce(nullif(trim(payload->>'firstName'), ''), '—'), 100),
    left(coalesce(nullif(trim(payload->>'lastName'), ''), '—'), 100),
    v_email,
    nullif(left(payload->>'phone', 40), ''),
    nullif(payload->>'phoneE164', ''),
    nullif(left(payload->>'originCountry', 80), '')
  )
  on conflict (email) where email is not null do update
    set phone          = coalesce(excluded.phone, public.clients.phone),
        phone_e164     = case when excluded.phone is not null then excluded.phone_e164 else public.clients.phone_e164 end,
        origin_country = coalesce(public.clients.origin_country, excluded.origin_country)
  returning id into v_client_id;

  v_quoted := public.resolve_price(v_service, v_package);
  if v_quoted is null then
    v_answers := v_answers || jsonb_build_object('price_unverified', true);
  end if;

  if coalesce((select value from public.app_settings where key = 'round_robin_enabled'), 'false'::jsonb) = 'true'::jsonb then
    v_assignee := public.pick_assignee();
  end if;

  begin
    insert into public.service_requests
      (client_id, service_type, destination_country, package_slug, status, source, source_url,
       original_message, form_answers, idempotency_key, quoted_price_cents, displayed_price_cents, assigned_to)
    values (
      v_client_id, v_service, nullif(payload->>'destinationCountry', ''), v_package, 'new', 'website_form',
      left(payload->>'sourceUrl', 500), left(payload->>'message', 2000), v_answers, v_key, v_quoted,
      case when payload ? 'displayedPriceCents' then (payload->>'displayedPriceCents')::int end,
      v_assignee
    )
    returning * into v_request;
  exception when unique_violation then
    select * into v_request from public.service_requests where idempotency_key = v_key;
    return jsonb_build_object('id', v_request.id, 'reference', v_request.reference, 'duplicate', true);
  end;

  return jsonb_build_object('id', v_request.id, 'reference', v_request.reference, 'duplicate', false);
end;
$$;
