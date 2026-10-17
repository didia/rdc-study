#!/usr/bin/env bash
# merge_clients() must lock the donor before copying it. Session A holds the donor row and edits its
# notes; session B (the merge) starts meanwhile. Without the locks B snapshots the old donor, waits on
# the keeper update, then deletes the donor and the committed note is lost. With them B waits for A
# first and the note is carried over to the keeper.
#
# pgTAP runs in a single session, hence this script. Needs the local stack (`supabase start`).
# Usage: npm run db:test:concurrency
set -euo pipefail

DB_CONTAINER="supabase_db_$(sed -n 's/^project_id *= *"\(.*\)"/\1/p' "$(dirname "$0")/../../config.toml")"
AGENT=00000000-0000-0000-0000-0000000000c3
KEEP=10000000-0000-0000-0000-0000000000c1
DROP=10000000-0000-0000-0000-0000000000c2
psql_() { docker exec -i "$DB_CONTAINER" psql -U postgres -qAt "$@"; }

cleanup() {
  psql_ -c "set session_replication_role = replica;
    delete from public.audit_events where metadata->>'dropped' = '$DROP';
    delete from public.clients where id in ('$KEEP', '$DROP');
    delete from public.staff_profiles where id = '$AGENT';
    delete from auth.users where id = '$AGENT';" >/dev/null
}
trap cleanup EXIT

psql_ <<SQL >/dev/null
insert into auth.users (id, instance_id, aud, role, email) values
  ('$AGENT', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'race-merge@test.local');
insert into public.staff_profiles (id, full_name, role) values ('$AGENT', 'Race Agent', 'agent');
insert into public.clients (id, first_name, last_name, email, notes) values
  ('$KEEP', 'Race', 'Keep', 'race-keep@test.local', null),
  ('$DROP', 'Race', 'Drop', 'race-drop@test.local', 'old note');
SQL

# Session A edits the donor and holds the row for 3 s; session B (the merge) starts 1 s in.
psql_ -c "begin; update public.clients set notes = 'new note' where id = '$DROP'; select pg_sleep(3); commit;" >/dev/null &
sleep 1
B_OUT=$(psql_ <<SQL 2>&1 || true
begin;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', '$AGENT', 'role', 'authenticated')::text, true);
select public.merge_clients('$KEEP', '$DROP');
commit;
SQL
)
wait

NOTES=$(psql_ -c "select notes from public.clients where id = '$KEEP'")
if grep -q "new note" <<<"$NOTES"; then
  echo "ok - a donor edit committed during the merge was carried over to the kept client"
else
  echo "FAIL - the kept client's notes are '$NOTES'; merge said: $B_OUT" >&2
  exit 1
fi
