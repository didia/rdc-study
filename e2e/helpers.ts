import {expect, type Page} from '@playwright/test';

// Synthetic staff created by the CI job / local setup with scripts/create-admin.mjs.
export const ADMIN = {email: process.env.E2E_ADMIN_EMAIL ?? 'e2e-admin@example.test', password: process.env.E2E_ADMIN_PASSWORD ?? 'e2e-admin-password-1'};

export async function signIn(page: Page, user = ADMIN) {
  await page.goto('/admin/login');
  await page.getByLabel('Adresse e-mail').fill(user.email);
  await page.getByLabel('Mot de passe').fill(user.password);
  await page.getByRole('button', {name: 'Se connecter'}).click();
  await expect(page).toHaveURL(/\/admin(\/|$)/);
  await expect(page.getByRole('heading', {name: /Aujourd'hui/})).toBeVisible();
}

export const uniqueEmail = (prefix: string) => `${prefix}.${Date.now()}@example.test`;

// Reads one stored request with the service-role key (PostgREST), e.g. to check a column the console does not render.
export async function fetchRequest(reference: string): Promise<{displayed_price_cents: number | null}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (see .env.local)');
  const response = await fetch(`${url}/rest/v1/service_requests?reference=eq.${encodeURIComponent(reference)}&select=displayed_price_cents`, {
    headers: {apikey: key, Authorization: `Bearer ${key}`},
  });
  expect(response.ok).toBe(true);
  const rows = await response.json();
  expect(rows).toHaveLength(1);
  return rows[0];
}
