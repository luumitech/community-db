import { expect, test } from '@playwright/test';
import { mongodbSeedFromFixture } from './utils/mongodb-seed';
import { navigatePropertyList } from './utils/navigate';

test.describe('Navigate to property list', () => {
  test.beforeEach('Mongo DB Seed', async ({ page }) => {
    await mongodbSeedFromFixture('simple.xlsx');
  });

  test('Check welcome page', async ({ page }) => {
    await navigatePropertyList(page);
  });
});
