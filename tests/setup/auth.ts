/* eslint-disable playwright/no-standalone-expect */
import { expect, test as setup } from '@playwright/test';
import fs from 'fs';
import { SETUP_FILE } from './setup-file';

setup('authenticate', async ({ browser }) => {
  const context = fs.existsSync(SETUP_FILE)
    ? await browser.newContext({ storageState: SETUP_FILE })
    : await browser.newContext();
  const page = await context.newPage();

  await page.goto('/');

  await page.request.post('/api/auth/sign-up/email', {
    data: {
      name: 'Test User',
      email: process.env.AUTH_TEST_EMAIL!,
      password: process.env.AUTH_TEST_PASSWORD!,
    },
  });

  const resp = await page.request.post('/api/auth/sign-in/email', {
    data: {
      email: process.env.AUTH_TEST_EMAIL!,
      password: process.env.AUTH_TEST_PASSWORD!,
    },
  });
  expect(resp.status()).toBe(200);

  // Store the authentication state for reuse in other tests
  await page.context().storageState({ path: SETUP_FILE });
});
