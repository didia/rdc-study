#!/usr/bin/env node
// Creates the first admin (or any staff member) straight in Supabase, bypassing the console.
//
//   node --env-file=.env.local scripts/create-admin.mjs --email you@example.com --name "Your Name" [--role admin] [--password '...']
//
// Without --password an invitation email is sent (the user chooses a password from the link).
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.
import {createClient} from '@supabase/supabase-js';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const email = arg('email');
const name = arg('name');
const role = arg('role') ?? 'admin';
const password = arg('password');

if (!email || !name || !['admin', 'agent', 'mentor', 'viewer'].includes(role)) {
  console.error('Usage: create-admin.mjs --email <email> --name <full name> [--role admin|agent|mentor|viewer] [--password <pwd>]');
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}
if (password && password.length < 12) {
  console.error('The password must contain at least 12 characters.');
  process.exit(1);
}

const supabase = createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});

const {data, error} = password
  ? await supabase.auth.admin.createUser({email, password, email_confirm: true})
  : await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/admin/auth/callback?next=/admin/mot-de-passe`,
    });
if (error) {
  console.error('Could not create the user:', error.message);
  process.exit(1);
}

const {error: profileError} = await supabase
  .from('staff_profiles')
  .upsert({id: data.user.id, full_name: name, role, active: true});
if (profileError) {
  console.error('User created but profile failed:', profileError.message);
  process.exit(1);
}
console.log(`${role} "${name}" <${email}> is ready${password ? '' : ' (invitation email sent)'}.`);
