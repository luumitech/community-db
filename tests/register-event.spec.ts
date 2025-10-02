import { expect, test } from '@playwright/test';
import { verifyTransaction } from './utils/event-util';
import { mongodbSeedFromFixture } from './utils/mongodb-seed';
import {
  clickButton,
  fillInput,
  navigateProperty,
  navigateRegisterEvent,
  select,
  selectDropdown,
} from './utils/navigate';

test.describe('Register event', () => {
  test.beforeEach('Mongo DB Seed', async ({ page }) => {
    await mongodbSeedFromFixture('simple-multisheet.xlsx');
  });

  test('Register event, and verify payment methods', async ({ page }) => {
    const currentEvent = 'Corn Roast';
    await navigateProperty(page, '99 Fortune Drive');
    await navigateRegisterEvent(page, currentEvent);

    // Add ticket and register for membership
    await selectDropdown(page, 'Add Ticket', 'meal');
    await fillInput(page, 'Ticket #', '1');
    await select(page, 'Transaction Total Payment Method', 'cash');
    await clickButton(page, 'Register');

    // Verify if payment is registered correctly
    await verifyTransaction(page, {
      currentEvent,
      expected: [
        { rowIdx: 0, expectValue: 'Membership Fee' },
        { rowIdx: 0, expectValue: 'cash' },
        { rowIdx: 1, expectValue: 'meal' },
        { rowIdx: 1, expectValue: 'cash' },
      ],
    });

    // Add another ticket
    await navigateRegisterEvent(page, currentEvent);
    await selectDropdown(page, 'Add Ticket', 'drink');
    await fillInput(page, 'Ticket #', '1');
    await select(page, 'Transaction Total Payment Method', 'e-Transfer');
    await clickButton(page, 'Save');

    // Verify if payment is registered correctly
    await verifyTransaction(page, {
      currentEvent,
      expected: [
        { rowIdx: 0, expectValue: 'Membership Fee' },
        { rowIdx: 0, expectValue: 'cash' },
        { rowIdx: 1, expectValue: 'meal' },
        { rowIdx: 1, expectValue: 'cash' },
        { rowIdx: 2, expectValue: 'drink' },
        { rowIdx: 2, expectValue: 'e-Transfer' },
      ],
    });
  });

  test('Register event with validation error, fix error, and register again', async ({
    page,
  }) => {
    const currentEvent = 'Summer Festival';
    await navigateProperty(page, '123 Adventure Drive');
    await navigateRegisterEvent(page, currentEvent);

    // Add ticket and register for membership
    await selectDropdown(page, 'Add Ticket', 'meal');
    await select(page, 'Transaction Total Payment Method', 'e-Transfer');
    await clickButton(page, 'Register');
    // We expect an validation error, correct the error and change the payment method
    await expect(
      page.getByText('Must specify price when Ticket # is not specified')
    ).toBeVisible();
    await fillInput(page, 'Ticket #', '1');
    await select(page, 'Transaction Total Payment Method', 'cash');
    await clickButton(page, 'Register');

    // Verify payment methods are registered correctly to both membership fee and meal
    await verifyTransaction(page, {
      currentEvent,
      expected: [
        { rowIdx: 0, expectValue: 'Membership Fee' },
        { rowIdx: 0, expectValue: 'cash' },
        { rowIdx: 1, expectValue: 'meal' },
        { rowIdx: 1, expectValue: 'cash' },
      ],
    });
  });
});
