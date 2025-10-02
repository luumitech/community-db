import { test as base, expect, type Page } from '@playwright/test';
import path from 'path';
import { type ScreenshotId } from '~/view/landing/feature-overview-image-list';
import { waitUntilStable } from '../utils/common';
import * as mapUtil from '../utils/leaflet-map';
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
  name: ScreenshotId
) {
  await page.screenshot({
    path: path.join(
      process.cwd(),
      'src',
      'app',
      'view',
      'landing',
      'feature-overview-image-list',
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
        localStorage.setItem('cd-import-first-time', 'false');
      },
      [theme]
    );

    // Select the first community
    await navigatePropertyList(page);
  });

  test('Property List', async ({ theme }) => {
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

    // Wait for all graphs to have been loaded
    const graphList = page.getByLabel('skeleton');
    await expect(graphList).toHaveCount(5);
    const items = await graphList.all();
    for (const item of items) {
      await expect(item).toHaveAttribute('data-loaded', 'true');
      await waitUntilStable(item);
    }

    // Scroll down and take screenshot
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

  test('Import with map', async ({ theme }) => {
    await headerMoreMenu(page, /Import Community/);

    // Change import method
    await select(page, 'Import Method', 'Draw map boundary');

    // Wait for address bar to show
    await mapUtil.searchAddress(
      page,
      'King Georges Road, Kingsway South, Etobicoke, Toronto'
    );

    // Once address is found, the zoom level is at maximum level
    await mapUtil.zoomOut(page);

    /**
     * Draw a polygon
     *
     * - Between King Georges Road and Varley Lane
     * - Between Jackson Avenue and Grenview Boulevard
     */
    await mapUtil.drawPolygon(page, [
      { x: 20, y: 255 },
      { x: 145, y: 275 },
      { x: 175, y: 380 },
      { x: 70, y: 415 },
    ]);

    await mapUtil.moveMap(page, [
      'ArrowDown',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
    ]);

    await takeScreenshot(page, theme, 'import-community-map');
  });
});
