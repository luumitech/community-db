import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { insertIf } from '~/lib/insert-if';
import { SETUP_FILE } from './tests/setup/setup-file';

/**
 * Read environment variables using dotenv
 *
 * See: https://github.com/motdotla/dotenv
 */
dotenv.config({
  path: [
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '.env.playwright'),
  ],
  override: true,
});

const SERVER_URL = 'http://localhost:3000';

/** See https://playwright.dev/docs/test-configuration. */
export default defineConfig({
  testDir: 'tests',
  /** Run tests in a single file in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /**
   * We don't want to run different spec test in parallel because most tests
   * rely on mongo seeded data from start of the test.
   */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: SERVER_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // video: {
    //   mode: 'on',
    //   size: { width: 640, height: 480 },
    // },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'authenticate',
      testMatch: 'setup/auth.ts',
    },
    /** Generate screenshots for landing page */
    ...(['dark', 'light'] as const).map((theme) => ({
      name: `screenshot-${theme}`,
      use: {
        ...devices['Desktop Chrome'],
        storageState: SETUP_FILE,
        theme,
      },
      dependencies: ['authenticate'],
      testMatch: 'screenshot/*.ts',
    })),
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: SETUP_FILE,
      },
      dependencies: ['authenticate'],
      testMatch: '*.spec.ts',
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // }

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'yarn dev:playwright',
    url: SERVER_URL,
    reuseExistingServer: !process.env.CI,
  },
});
