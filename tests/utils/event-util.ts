import { expect, type Page } from '@playwright/test';
import { waitUntilStable } from './common';
import { clickButton, navigateRegisterEvent } from './navigate';

interface VerifyTransactionOpt {
  currentEvent: string;
  expected: { rowIdx: number; expectValue: string | RegExp }[];
}

/**
 * Use this function to verify transaction details
 *
 * - Navigate from `/community/[communityId]/property/[propertyId]/view`
 */
export async function verifyTransaction(page: Page, opt: VerifyTransactionOpt) {
  await navigateRegisterEvent(page, opt.currentEvent);

  await page.getByLabel('Previous Transaction Toggle').click();
  const transactionList = page
    .getByLabel('Previous Transaction List')
    .getByRole('row');
  for (const { rowIdx, expectValue } of opt.expected) {
    const row1 = transactionList.nth(rowIdx);
    await expect(row1).toContainText(expectValue);
  }

  await clickButton(page, 'Cancel');
}
