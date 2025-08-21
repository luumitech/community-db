import { test as base, expect, type Page } from '@playwright/test';
import path from 'path';
import {
  mongodbSeedFromFixture,
  mongodbSeedRandom,
} from '../utils/mongodb-seed';
import {
  clickButton,
  headerMoreMenu,
  navigatePropertyList,
  select,
  waitForDialog,
} from '../utils/navigate';

interface ScreenshotOptions {
  theme: 'dark' | 'light';
}

const test = base.extend<ScreenshotOptions>({
  theme: ['light', { option: true }],
});

/**
 * Save screenshots in a dedicated folder within the app directory
 *
 * - This is used for display screenshots in the landing page
 */
async function takeScreenshot(
  page: Page,
  theme: 'light' | 'dark',
  name: string
) {
  await page.screenshot({
    path: path.join(
      process.cwd(),
      'src',
      'app',
      'view',
      'landing',
      'feature-overview',
      'screenshots',
      theme,
      `${name}.png`
    ),
  });
}

/**
 * Screenshot tests are required to be running in serial
 *
 * - This way, it's easier to jump from one screen to the next
 */
test.describe.serial('Take @screenshot for landing screen', () => {
  let page: Page;

  test.beforeAll('Mongo DB Seed', async ({ browser, theme }) => {
    await mongodbSeedFromFixture('db-screenshot.xlsx');

    // Seed data randomly to introduce current year into data
    // await mongodbSeedRandom(10);

    page = await browser.newPage();
    // Set appropriate viewport size for taking screenshots
    await page.setViewportSize({ width: 1000, height: 700 });

    await page.goto('/');
    await page.evaluate(
      ([_theme]) => {
        // Set theme to light theme
        localStorage.setItem('theme', _theme);
      },
      [theme]
    );
  });

  test('Property List', async ({ theme }) => {
    await navigatePropertyList(page);
    await takeScreenshot(page, theme, 'property-list');
  });

  test('Property Details', async ({ theme }) => {
    const rows = page.getByLabel('Property Table').locator('tbody > tr');
    const membersInCurYear = rows
      // Members name is non empty
      .filter({
        has: page.locator('td:nth-child(2)').filter({ hasText: /./ }),
      })
      // Current year has checkmark
      .filter({
        has: page.locator('td:nth-child(3) svg'),
      });
    await membersInCurYear.nth(0).click();

    await expect(page.getByText('Membership Status')).not.toBeEmpty();
    await takeScreenshot(page, theme, 'property-detail');
  });

  test('Membership Editor', async ({ theme }) => {
    await headerMoreMenu(page, /Edit Membership Detail/);
    await waitForDialog(page, /Edit Membership Detail/);
    await takeScreenshot(page, theme, 'membership-editor');
    await clickButton(page, 'Cancel');
  });

  test('Occupant Editor', async ({ theme }) => {
    await headerMoreMenu(page, /Edit Contact Information/);
    await waitForDialog(page, /Edit Contact Information/);
    await takeScreenshot(page, theme, 'occupant-editor');
    await clickButton(page, 'Cancel');
  });

  test('Dashboard', async ({ theme }) => {
    await headerMoreMenu(page, /Dashboard/);
    // Wait for graphs to be loaded
    const graphList = page.locator('div.grid div[data-loaded="true"]');
    await expect(graphList.nth(3)).toBeAttached();
    await page.evaluate(() => window.scrollBy(0, 370));
    await takeScreenshot(page, theme, 'dashboard');
  });

  test('Export to Excel', async ({ theme }) => {
    await headerMoreMenu(page, /Export to Excel/);

    // Change export method
    await select(page, 'Export Methods', 'Single Sheet');

    // Make sure table is propagated with data
    const table = page.getByTestId('export-xlsx');
    const rows = table.locator('tbody > tr');
    await expect(rows.nth(5)).toBeVisible();

    await takeScreenshot(page, theme, 'export-to-xlsx');
  });
});
