import { expect, test, type Page } from '@playwright/test';
import { mongodbSeedRandom } from './utils/mongodb-seed';
import {
  clickButton,
  headerMoreMenu,
  navigatePropertyList,
  select,
  waitForDialog,
} from './utils/navigate';
import { takeScreenshot } from './utils/screenshot';

/**
 * Screenshot tests are required to be running in serial
 *
 * - This way, it's easier to jump from one screen to the next
 */
test.describe.serial('Take @screenshot for landing screen', () => {
  let page: Page;

  test.beforeAll('Mongo DB Seed', async ({ browser }) => {
    // Seed data if database doesn't exist
    // await mongodbSeedRandom(10);

    page = await browser.newPage();
    // Set appropriate viewport size for taking screenshots
    await page.setViewportSize({ width: 1000, height: 700 });
  });

  test('Property List', async () => {
    await navigatePropertyList(page);
    await takeScreenshot(page, 'property-list');
  });

  test('Property Details', async () => {
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
    await takeScreenshot(page, 'property-detail');
  });

  test('Membership Editor', async () => {
    await headerMoreMenu(page, /Edit Membership Detail/);
    await waitForDialog(page, /Edit Membership Detail/);
    await takeScreenshot(page, 'membership-editor');
    await clickButton(page, 'Cancel');
  });

  test('Occupant Editor', async () => {
    await headerMoreMenu(page, /Edit Contact Information/);
    await waitForDialog(page, /Edit Contact Information/);
    await takeScreenshot(page, 'occupant-editor');
    await clickButton(page, 'Cancel');
  });

  test('Dashboard', async () => {
    await headerMoreMenu(page, /Dashboard/);
    // Wait for graphs to be loaded
    const graphList = page.locator('div.grid div[data-loaded="true"]');
    await expect(graphList.nth(3)).toBeAttached();
    await page.evaluate(() => window.scrollBy(0, 370));
    await takeScreenshot(page, 'dashboard');
  });

  test('Export to Excel', async () => {
    await headerMoreMenu(page, /Export to Excel/);

    // Change export method
    await select(page, 'Export Methods', 'Single Sheet');

    // Make sure table is propagated with data
    const table = page.getByTestId('export-xlsx');
    const rows = table.locator('tbody > tr');
    await expect(rows.nth(5)).toBeVisible();

    await takeScreenshot(page, 'export-to-xlsx');
  });
});
