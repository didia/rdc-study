-- Phase 3A: agreed price, payments ledger (immutable, void instead of delete), revenue functions.

-- Delivery statuses become visible (Phase 3 gives them a purpose); `completed` closes a request.
update public.request_statuses set is_active = true where code in ('paid', 'in_progress', 'completed');

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
    if new_stage = 'lost' or new.status = 'completed' then
      new.closed_at = coalesce(new.closed_at, now());
    else
      new.closed_at = null;
    end if;
    if new_stage <> 'lost' then
      new.lost_reason = null;
    end if;
  end if;
  return new;
end;
$$;

alter table public.service_requests
  add column agreed_price_cents int check (agreed_price_cents is null or agreed_price_cents >= 0),
  add column agreed_currency text not null default 'USD';

-- ---------------------------------------------------------------------------
-- Payments (money records are never edited or deleted: a mistake is voided)
-- ---------------------------------------------------------------------------

create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  request_id   uuid not null references public.service_requests (id) on delete restrict,
  kind         text not null check (kind in ('deposit', 'balance', 'full', 'refund')),
  amount_cents int not null check (amount_cents > 0),
  currency     text not null default 'USD' check (currency in ('USD', 'CDF', 'EUR')),
  method       text not null check (method in ('mobile_money', 'cash_office', 'bank_transfer', 'other')),
  external_ref text,
  paid_at      timestamptz not null,
  recorded_by  uuid references public.staff_profiles (id),
  note         text,
  voided_at    timestamptz,
  voided_by    uuid references public.staff_profiles (id),
  void_reason  text,
  created_at   timestamptz not null default now(),
  check ((voided_at is null) = (void_reason is null))
);
create index payments_request_idx on public.payments (request_id);
create index payments_paid_at_idx on public.payments (paid_at desc);

create function public.payments_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.recorded_by = coalesce(new.recorded_by, auth.uid());
    new.voided_at = null; new.voided_by = null; new.void_reason = null;
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
  new.voided_by = coalesce(auth.uid(), new.voided_by);
  return new;
end;
$$;
create trigger payments_guard before insert or update on public.payments
  for each row execute function public.payments_guard();

-- Timeline entry for every recorded / voided payment.
create function public.log_payment() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.request_id, 'payment', new.note, auth.uid(),
            jsonb_build_object('action', 'recorded', 'payment_id', new.id, 'kind', new.kind,
                               'amount_cents', new.amount_cents, 'currency', new.currency, 'method', new.method));
  else
    insert into public.request_events (request_id, type, body, actor_id, metadata)
    values (new.request_id, 'payment', new.void_reason, auth.uid(),
            jsonb_build_object('action', 'voided', 'payment_id', new.id, 'kind', new.kind,
                               'amount_cents', new.amount_cents, 'currency', new.currency, 'method', new.method));
  end if;
  return null;
end;
$$;
create trigger payments_log after insert or update on public.payments
  for each row execute function public.log_payment();
revoke all on function public.payments_guard(), public.log_payment() from public, anon;

-- Net money received per request and currency (never summed across currencies); voided payments ignored.
create view public.request_paid with (security_invoker = true) as
  select request_id, currency,
         sum(case when kind = 'refund' then -amount_cents else amount_cents end)::bigint as net_cents
    from public.payments
   where voided_at is null
   group by request_id, currency;

revoke all on public.payments, public.request_paid from anon;
grant select, insert, update on public.payments to authenticated;
grant select on public.request_paid to authenticated;
grant all on public.payments, public.request_paid to service_role;
alter table public.payments enable row level security;
create policy payments_select on public.payments for select to authenticated using (public.staff_role() in ('admin', 'agent'));
create policy payments_insert on public.payments for insert to authenticated
  with check (public.staff_role() in ('admin', 'agent') and recorded_by = auth.uid());
create policy payments_void on public.payments for update to authenticated
  using (public.staff_role() = 'admin') with check (public.staff_role() = 'admin');

-- Deposit rule (share of the agreed price), editable in /admin/parametres.
insert into public.app_settings (key, value) values ('deposit_share', '0.5'::jsonb);

-- ---------------------------------------------------------------------------
-- Revenue reporting (non-voided payments only; every figure is per currency)
-- ---------------------------------------------------------------------------

create function public.fn_revenue_by(p_dimension text, p_from timestamptz, p_to timestamptz)
returns table (label text, currency text, net_cents bigint, payments int)
language plpgsql stable set search_path = '' as $$
declare
  expr text;
begin
  expr := case p_dimension
    when 'month'       then 'to_char(p.paid_at, ''YYYY-MM'')'
    when 'method'      then 'p.method'
    when 'destination' then 'coalesce(r.destination_country, ''—'')'
    when 'package'     then 'coalesce(r.package_slug, ''—'')'
    else null end;
  if expr is null then
    raise exception 'unknown dimension %', p_dimension using errcode = '22023';
  end if;
  return query execute format($q$
    select %s as label, p.currency,
           sum(case when p.kind = 'refund' then -p.amount_cents else p.amount_cents end)::bigint as net_cents,
           count(*)::int as payments
      from public.payments p
      join public.service_requests r on r.id = p.request_id
     where p.voided_at is null and p.paid_at >= $1 and p.paid_at < $2
     group by 1, 2
     order by 1, 2
  $q$, expr) using p_from, p_to;
end;
$$;

-- Money still to collect: agreed (or quoted) price minus net payments, for requests that are won or awaiting payment.
create function public.fn_outstanding()
returns table (currency text, outstanding_cents bigint, requests int)
language sql stable set search_path = '' as $$
  select r.agreed_currency,
         sum(coalesce(r.agreed_price_cents, r.quoted_price_cents) - coalesce(pd.net_cents, 0))::bigint,
         count(*)::int
    from public.service_requests r
    left join public.request_paid pd on pd.request_id = r.id and pd.currency = r.agreed_currency
   where r.status in ('awaiting_payment', 'deposit_paid', 'paid', 'in_progress', 'completed')
     and coalesce(r.agreed_price_cents, r.quoted_price_cents) is not null
     and coalesce(r.agreed_price_cents, r.quoted_price_cents) - coalesce(pd.net_cents, 0) > 0
   group by r.agreed_currency;
$$;

-- Average days between the deposit and completion, and the share of paid money that was refunded.
create function public.fn_delivery_stats(p_from timestamptz, p_to timestamptz)
returns table (avg_days_deposit_to_completed numeric, completed_count int, refunded_share numeric)
language sql stable set search_path = '' as $$
  with dep as (
    select e.request_id, min(e.created_at) as at from public.request_events e
     where e.type = 'status_change' and e.to_status = 'deposit_paid' group by e.request_id
  ), done as (
    select e.request_id, min(e.created_at) as at from public.request_events e
     where e.type = 'status_change' and e.to_status = 'completed' and e.created_at >= p_from and e.created_at < p_to
     group by e.request_id
  )
  select (select round(avg(extract(epoch from done.at - dep.at) / 86400)::numeric, 1) from done join dep using (request_id)),
         (select count(*)::int from done),
         (select case when sum(amount_cents) filter (where kind <> 'refund') > 0
                      then round((sum(amount_cents) filter (where kind = 'refund'))::numeric
                                 / (sum(amount_cents) filter (where kind <> 'refund')), 3) end
            from public.payments where voided_at is null and paid_at >= p_from and paid_at < p_to);
$$;

revoke all on function public.fn_revenue_by(text, timestamptz, timestamptz), public.fn_outstanding(),
  public.fn_delivery_stats(timestamptz, timestamptz) from public, anon;
grant execute on function public.fn_revenue_by(text, timestamptz, timestamptz), public.fn_outstanding(),
  public.fn_delivery_stats(timestamptz, timestamptz) to authenticated;
