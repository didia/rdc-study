-- Phase 1C: public intake (submit_service_request), rate limiting, price editing RPC.

-- ---------------------------------------------------------------------------
-- Prices: allow removing an exception row (never the default '*' row) and keep the history.
-- ---------------------------------------------------------------------------

alter table public.service_price_history alter column new_amount_cents drop not null;

create or replace function public.log_price_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    insert into public.service_price_history
      (service_type, scope, old_amount_cents, new_amount_cents, currency, reason, changed_by)
    values (old.service_type, old.scope, old.amount_cents, null, old.currency,
            nullif(current_setting('app.price_reason', true), ''), auth.uid());
    return null;
  end if;

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

drop trigger sp_history on public.service_prices;
create trigger sp_history after insert or update or delete on public.service_prices
  for each row execute function public.log_price_change();

create policy prices_delete on public.service_prices for delete to authenticated
  using (public.staff_role() = 'admin' and scope <> '*');
grant delete on public.service_prices to authenticated;

-- One transaction: set the reason the history trigger reads, then upsert (RLS: admins only).
create function public.set_service_price(p_service_type text, p_scope text, p_amount_cents int, p_reason text)
returns void
language plpgsql set search_path = '' as $$
begin
  if coalesce(trim(p_reason), '') = '' then
    raise exception 'A reason is required' using errcode = 'P0001';
  end if;
  perform set_config('app.price_reason', trim(p_reason), true);
  insert into public.service_prices (service_type, scope, amount_cents)
  values (p_service_type, p_scope, p_amount_cents)
  on conflict (service_type, scope) do update set amount_cents = excluded.amount_cents;
end;
$$;

create function public.remove_service_price(p_service_type text, p_scope text, p_reason text)
returns void
language plpgsql set search_path = '' as $$
begin
  if coalesce(trim(p_reason), '') = '' then
    raise exception 'A reason is required' using errcode = 'P0001';
  end if;
  perform set_config('app.price_reason', trim(p_reason), true);
  delete from public.service_prices where service_type = p_service_type and scope = p_scope;
end;
$$;

revoke all on function public.set_service_price(text, text, int, text) from public, anon;
revoke all on function public.remove_service_price(text, text, text) from public, anon;
grant execute on function public.set_service_price(text, text, int, text) to authenticated;
grant execute on function public.remove_service_price(text, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Rate limiting for the public intake route (keys are hashed IPs, never raw addresses)
-- ---------------------------------------------------------------------------

create table public.rate_limits (
  key          text not null,
  window_start timestamptz not null,
  hits         int not null default 0,
  primary key (key, window_start)
);
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;
grant all on public.rate_limits to service_role;

-- Counts this hit and says whether the caller is still under the limit.
create function public.check_rate_limit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  bucket timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  current_hits int;
begin
  insert into public.rate_limits as r (key, window_start, hits)
  values (p_key, bucket, 1)
  on conflict (key, window_start) do update set hits = r.hits + 1
  returning r.hits into current_hits;

  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;
  return current_hits <= p_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- Public intake: client upsert -> request -> events, in one transaction
-- ---------------------------------------------------------------------------

create function public.submit_service_request(payload jsonb)
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
begin
  if v_service is null or v_email is null then
    raise exception 'serviceType and email are required' using errcode = '22023';
  end if;

  -- Double submit: hand back the original request.
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

  begin
    insert into public.service_requests
      (client_id, service_type, destination_country, package_slug, status, source, source_url,
       original_message, form_answers, idempotency_key, quoted_price_cents, displayed_price_cents)
    values (
      v_client_id, v_service, nullif(payload->>'destinationCountry', ''), v_package, 'new', 'website_form',
      left(payload->>'sourceUrl', 500), left(payload->>'message', 2000), v_answers, v_key, v_quoted,
      case when payload ? 'displayedPriceCents' then (payload->>'displayedPriceCents')::int end
    )
    returning * into v_request;
  exception when unique_violation then
    -- Lost a race against the same idempotency key.
    select * into v_request from public.service_requests where idempotency_key = v_key;
    return jsonb_build_object('id', v_request.id, 'reference', v_request.reference, 'duplicate', true);
  end;

  return jsonb_build_object('id', v_request.id, 'reference', v_request.reference, 'duplicate', false);
end;
$$;

revoke all on function public.submit_service_request(jsonb) from public, anon, authenticated;
revoke all on function public.check_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.submit_service_request(jsonb) to service_role;
grant execute on function public.check_rate_limit(text, int, int) to service_role;
