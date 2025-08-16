/* eslint-disable playwright/no-standalone-expect */
import { expect, test as setup } from '@playwright/test';
import path from 'path';

/**
 * File for storing authentication state
 *
 * This is used in playwright.config.ts
 */
const authFile = path.join(process.cwd(), 'playwright', '.setup', 'auth.json');

setup('authenticate', async ({ page }) => {
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
  await page.context().storageState({ path: authFile });

  await page.evaluate(() => {
    // Set theme to light theme
    localStorage.setItem('theme', 'light');
  });
});
