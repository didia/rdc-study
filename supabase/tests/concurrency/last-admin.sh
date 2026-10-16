#!/usr/bin/env bash
# Two sessions each deactivate a different one of the only two active admins. Without
# serialization both commit (write skew) and the console is left without an admin; with the
# advisory lock in staff_profiles_guard() the second one must fail.
#
# pgTAP runs in a single session, hence this script. Needs the local stack (`supabase start`) on
# a database where the only active admins are the two fixtures this script creates (e.g. right
# after `supabase db reset`). Usage: npm run db:test:concurrency
set -euo pipefail

DB_CONTAINER="supabase_db_$(sed -n 's/^project_id *= *"\(.*\)"/\1/p' "$(dirname "$0")/../../config.toml")"
A=00000000-0000-0000-0000-0000000000c1
B=00000000-0000-0000-0000-0000000000c2
psql_() { docker exec -i "$DB_CONTAINER" psql -U postgres -qAt "$@"; }

cleanup() {
  psql_ -c "set session_replication_role = replica; delete from public.staff_profiles where id in ('$A', '$B'); delete from auth.users where id in ('$A', '$B');" >/dev/null
}
trap cleanup EXIT

if [ "$(psql_ -c "select count(*) from public.staff_profiles where role = 'admin' and active and id not in ('$A', '$B')")" != "0" ]; then
  echo "SKIP: other active admins exist; run on a freshly reset local database" >&2
  exit 2
fi

psql_ <<SQL >/dev/null
insert into auth.users (id, instance_id, aud, role, email) values
  ('$A', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'race-a@test.local'),
  ('$B', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'race-b@test.local');
insert into public.staff_profiles (id, full_name, role) values ('$A', 'Race A', 'admin'), ('$B', 'Race B', 'admin');
SQL

# Session A holds its (uncommitted) deactivation for 3 s; session B starts 1 s in.
psql_ -c "begin; update public.staff_profiles set active = false where id = '$A'; select pg_sleep(3); commit;" >/dev/null &
sleep 1
B_OUT=$(psql_ -c "begin; update public.staff_profiles set active = false where id = '$B'; commit;" 2>&1 || true)
wait

REMAINING=$(psql_ -c "select count(*) from public.staff_profiles where role = 'admin' and active and id in ('$A', '$B')")
if [ "$REMAINING" = "1" ] && grep -q "last active admin" <<<"$B_OUT"; then
  echo "ok - concurrent removal of both admins was refused (1 active admin left)"
else
  echo "FAIL - $REMAINING active admin(s) left; second session said: $B_OUT" >&2
  exit 1
fi
