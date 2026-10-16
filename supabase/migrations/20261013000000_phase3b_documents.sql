-- Phase 3B: private document storage, document records, versioned contract/receipt templates, client address.

alter table public.clients add column address text;

-- ---------------------------------------------------------------------------
-- Documents
-- ---------------------------------------------------------------------------

create table public.request_documents (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references public.service_requests (id) on delete cascade,
  kind          text not null check (kind in ('contract', 'receipt', 'client_document', 'deliverable', 'other')),
  storage_path  text not null unique,
  file_name     text not null check (char_length(file_name) between 1 and 200),
  mime_type     text,
  size_bytes    int check (size_bytes is null or size_bytes between 0 and 10485760),
  uploaded_by   uuid references public.staff_profiles (id),
  created_at    timestamptz not null default now(),
  -- Path convention: request/<request_id>/<uuid>-<filename>
  check (storage_path like 'request/' || request_id::text || '/%')
);
create index request_documents_request_idx on public.request_documents (request_id, created_at desc);

create function public.log_document() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.request_events (request_id, type, body, actor_id, metadata)
  values (new.request_id, 'document', new.file_name, new.uploaded_by,
          jsonb_build_object('document_id', new.id, 'kind', new.kind));
  return null;
end;
$$;
revoke all on function public.log_document() from public, anon;
create trigger request_documents_log after insert on public.request_documents
  for each row execute function public.log_document();

revoke all on public.request_documents from anon, authenticated;
grant select, insert on public.request_documents to authenticated;
grant all on public.request_documents to service_role;
alter table public.request_documents enable row level security;
create policy documents_select on public.request_documents for select to authenticated
  using (public.staff_role() in ('admin', 'agent'));
create policy documents_insert on public.request_documents for insert to authenticated
  with check (public.staff_role() in ('admin', 'agent') and uploaded_by = auth.uid());

-- ---------------------------------------------------------------------------
-- Merging duplicate clients must not lose the address added in this phase
-- (same function as Phase 2B, plus address inheritance; grants are preserved by CREATE OR REPLACE)
-- ---------------------------------------------------------------------------

-- Moves every request of `p_drop` to `p_keep`, fills the blanks of `p_keep`, logs it, removes `p_drop`.
create or replace function public.merge_clients(p_keep uuid, p_drop uuid)
returns int
language plpgsql security definer set search_path = '' as $$
declare
  moved int;
  dropped public.clients;
begin
  -- staff_role() is NULL for a deactivated account or a session that has not passed MFA: fail closed.
  if not coalesce(public.staff_role() in ('admin', 'agent'), false) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  if p_keep = p_drop then
    raise exception 'Cannot merge a client with itself' using errcode = '22023';
  end if;

  -- Lock both rows (in a fixed order, so two merges cannot deadlock) before reading either, so a
  -- concurrent edit of the donor is either merged or waits; it is never silently lost.
  perform 1 from public.clients where id in (p_keep, p_drop) order by id for update;
  select * into dropped from public.clients where id = p_drop;
  if not found or not exists (select 1 from public.clients where id = p_keep) then
    raise exception 'Client not found' using errcode = 'P0002';
  end if;

  -- The donor's email must be released first: it is unique and enforced immediately.
  update public.clients set email = null where id = p_drop;

  update public.clients k set
    email          = coalesce(k.email, dropped.email),
    -- The raw phone and its normalized form travel together: inherit the donor's pair only when the keeper has neither.
    phone          = case when k.phone is null and k.phone_e164 is null then dropped.phone else k.phone end,
    phone_e164     = case when k.phone is null and k.phone_e164 is null then dropped.phone_e164 else k.phone_e164 end,
    origin_country = coalesce(k.origin_country, dropped.origin_country),
    address        = coalesce(k.address, dropped.address),
    notes          = nullif(concat_ws(E'\n', k.notes, dropped.notes), '')
   where k.id = p_keep;

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


-- ---------------------------------------------------------------------------
-- Private bucket: 10 MB, allow-listed types, access mirrors the table policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('request-docs', 'request-docs', false, 10485760, array[
  'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.text'
])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Reading an object (and therefore minting a signed URL for it) needs a document row the caller may see.
create policy request_docs_read on storage.objects for select to authenticated
  using (bucket_id = 'request-docs'
         and exists (select 1 from public.request_documents d where d.storage_path = name));
-- Cleanup: staff can remove an object that never got a document row (a registration that failed after the
-- upload). A registered document is never deletable, and an unregistered object is unreadable to everyone anyway.
create policy request_docs_cleanup on storage.objects for delete to authenticated
  using (bucket_id = 'request-docs' and public.staff_role() in ('admin', 'agent')
         and not exists (select 1 from public.request_documents d where d.storage_path = name));
-- Uploading: staff who can edit, into the request/ prefix only.
create policy request_docs_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'request-docs' and name like 'request/%' and public.staff_role() in ('admin', 'agent'));

-- ---------------------------------------------------------------------------
-- Versioned document templates (contract, receipt). Editing = a new version; old PDFs are never rewritten.
-- ---------------------------------------------------------------------------

create table public.document_templates (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('contract', 'receipt')),
  version     int not null,
  title       text not null,
  body        text not null,
  created_by  uuid references public.staff_profiles (id),
  created_at  timestamptz not null default now(),
  unique (kind, version)
);

revoke all on public.document_templates from anon, authenticated;
grant select, insert on public.document_templates to authenticated;
grant all on public.document_templates to service_role;
alter table public.document_templates enable row level security;
create policy doc_templates_select on public.document_templates for select to authenticated
  using (public.staff_role() is not null);
create policy doc_templates_insert on public.document_templates for insert to authenticated
  with check (public.staff_role() = 'admin' and created_by = auth.uid());

insert into public.document_templates (kind, version, title, body) values
  ('contract', 1, 'Contrat de service – RDC Études',
E'Entre RDC Études et {{client_name}}{{client_address}}, il est convenu ce qui suit.\n\n'
'Article 1 – Objet. RDC Études accompagne le client pour le dossier suivant : {{package}} (référence {{reference}}).\n\n'
'Article 2 – Prix et paiement. Le prix convenu est de {{price}}. Il est payable en deux tranches : un acompte de {{deposit}} à la signature, puis le solde de {{balance}} selon l''avancement du dossier. Modalités de paiement : {{payment_instructions}}\n\n'
'Article 3 – Engagements. RDC Études s''engage à orienter et assister le client dans ses démarches ; la décision d''admission ou de visa appartient exclusivement aux autorités compétentes et n''est pas garantie.\n\n'
'Article 4 – Données personnelles. Les informations du client sont traitées uniquement pour la gestion de son dossier, conformément à la politique de confidentialité de RDC Études.\n\n'
'Fait le {{date}}.'),
  ('receipt', 1, 'Reçu de paiement',
E'RDC Études reconnaît avoir reçu de {{client_name}} la somme de {{amount}} ({{kind}}) le {{paid_date}}, par {{method}}{{external_ref}}.\n\n'
'Dossier : {{package}} – référence {{reference}}.\n\nFait le {{date}}.');
