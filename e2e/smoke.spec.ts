import {expect, test} from '@playwright/test';

import {signIn, uniqueEmail} from './helpers';

test('health probe answers without touching the database', async ({request}) => {
  const response = await request.get('/api/requests/health');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ok: true});
});

test('the console is private: anonymous visitors are sent to the login page', async ({page}) => {
  await page.goto('/admin/demandes');
  await expect(page).toHaveURL(/\/admin\/login/);
  const response = await page.request.get('/admin/demandes', {maxRedirects: 0});
  expect(response.headers()['x-robots-tag']).toContain('noindex');
});

test('login, then create a request by hand and change its status', async ({page}) => {
  await signIn(page);

  const email = uniqueEmail('manual');
  await page.goto('/admin/demandes/nouvelle');
  await page.getByLabel('Prénom').fill('Test');
  await page.getByLabel('Nom de famille').fill('Playwright');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByRole('button', {name: 'Créer la demande'}).click();
  await expect(page).toHaveURL(/\/admin\/demandes\/[0-9a-f-]{36}/);
  await expect(page.getByText('Nouvelle demande').first()).toBeVisible();

  await page.getByLabel('Statut', {exact: true}).selectOption({label: 'Contact initial'});
  await page.getByRole('button', {name: 'Changer le statut'}).click();
  await expect(page.getByText('Statut mis à jour.')).toBeVisible();
  await expect(page.getByText(/Statut : Nouvelle demande → Contact initial/)).toBeVisible();
});

test('a website request sent to the intake API shows up in the console', async ({page, request}) => {
  const email = uniqueEmail('intake');
  const response = await request.post('/api/requests', {
    data: {
      idempotencyKey: `e2e-${Date.now()}-0001`,
      firstName: 'Intake',
      lastName: 'Playwright',
      email,
      originCountry: 'Guinée',
      destinationCountry: 'canada',
      packageSlug: 'canada/visa',
      serviceType: 'assistance',
      formAnswers: {hasAdmission: true},
      message: 'Message de test',
      sourceUrl: 'http://localhost/assistance-process',
      displayedPriceCents: 60000,
    },
  });
  expect(response.status()).toBe(200);
  const {reference} = await response.json();
  expect(reference).toMatch(/^RDC-\d{4}-\d{4,}$/);

  await signIn(page);
  await page.goto(`/admin/demandes?q=${encodeURIComponent(email)}`);
  await expect(page.getByRole('link', {name: reference})).toBeVisible();
});

test('the intake API refuses malformed requests', async ({request}) => {
  const response = await request.post('/api/requests', {data: {email: 'nope'}});
  expect(response.status()).toBe(422);
});

test('the public assistance form stores a request with the price shown to the visitor', async ({page}) => {
  const email = uniqueEmail('form');
  await page.goto('/assistance-process?pour=belgique/admission');
  // Step 1 (Belgium: do you hold a higher-education diploma?) keeps its default answer.
  await page.getByRole('button', {name: /suivant/i}).click();

  await page.locator('input[name="firstName"]').fill('Form');
  await page.locator('input[name="lastName"]').fill('Playwright');
  await page.locator('form input[name="email"]').first().fill(email);
  await page.locator('input[name="phone"]').fill('+243 81 000 0099');
  await page.locator('select[name="originCountry"]').selectOption({label: 'Guinée'});
  await page.getByRole('button', {name: /suivant/i}).click();

  await expect(page.getByText(/400 \$ US/).first()).toBeVisible(); // admission: default price
  await page.locator('label', {has: page.locator('input[type="radio"][value="assistance"]')}).click();
  await page.getByRole('button', {name: /soumettre/i}).click();
  await page.getByRole('button', {name: /Oui, je souhaite/}).click();
  await expect(page.getByText(/numéro de référence/i)).toBeVisible({timeout: 15_000});

  await signInAgain(page);
  await page.goto(`/admin/demandes?q=${encodeURIComponent(email)}`);
  await expect(page.getByText('Belgique – Admission')).toBeVisible();
});

async function signInAgain(page: import('@playwright/test').Page) {
  const {signIn} = await import('./helpers');
  await signIn(page);
}
