import {defineConfig, devices} from '@playwright/test';

// Smoke tests against a production build and a local Supabase stack (see .github/workflows/nodejs.yml, job `e2e`).
// Locally: `supabase start`, put its URL/keys in .env.local, `npm run build`, then `npm run test:e2e`.
const port = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: {timeout: 10_000},
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', {open: 'never'}]] : 'list',
  use: {baseURL: `http://localhost:${port}`, trace: 'retain-on-failure'},
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  webServer: {
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}/api/requests/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
