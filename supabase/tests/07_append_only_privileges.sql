begin;
create extension if not exists pgtap with schema extensions;
select plan(11);

-- Append-only / immutable tables must not hand out DELETE (or UPDATE) privileges, whatever the platform's defaults are.
select is(has_table_privilege('authenticated', 'public.request_events', 'DELETE'), false, 'request_events: no DELETE');
select is(has_table_privilege('authenticated', 'public.request_events', 'UPDATE'), false, 'request_events: no UPDATE');
select is(has_table_privilege('authenticated', 'public.service_price_history', 'DELETE'), false, 'service_price_history: no DELETE');
select is(has_table_privilege('authenticated', 'public.service_price_history', 'UPDATE'), false, 'service_price_history: no UPDATE');
select is(has_table_privilege('authenticated', 'public.audit_events', 'DELETE'), false, 'audit_events: no DELETE');
select is(has_table_privilege('authenticated', 'public.audit_events', 'UPDATE'), false, 'audit_events: no UPDATE');
select is(has_table_privilege('authenticated', 'public.payments', 'DELETE'), false, 'payments: no DELETE');
select is(has_table_privilege('authenticated', 'public.request_documents', 'DELETE'), false, 'request_documents: no DELETE');
select is(has_table_privilege('authenticated', 'public.request_documents', 'UPDATE'), false, 'request_documents: no UPDATE');
select is(has_table_privilege('authenticated', 'public.document_templates', 'UPDATE'), false, 'document_templates: no UPDATE (new versions only)');
select is(has_table_privilege('authenticated', 'public.document_templates', 'DELETE'), false, 'document_templates: no DELETE');

select * from finish();
rollback;
