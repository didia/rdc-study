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
