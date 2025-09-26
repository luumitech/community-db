import { expect, test } from '@playwright/test';
import { mongodbSeedFromFixture } from './utils/mongodb-seed';
import { navigatePropertyList } from './utils/navigate';

test.describe('Basic navigation', () => {
  test.beforeEach('Mongo DB Seed', async ({ page }) => {
    await mongodbSeedFromFixture('simple-lcra.xlsx');
  });

  test('Navigate to property list', async ({ page }) => {
    await navigatePropertyList(page);
    expect(true).toBeTruthy();
  });
});
