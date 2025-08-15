import { expect, type Page } from '@playwright/test';
import { waitUntilStable } from './common';

/**
 * Navigate the property list page
 *
 * - Navigate from `/community`
 */
export async function navigatePropertyList(page: Page) {
  await page.goto('/community');
  await expect(page.getByText('Welcome!')).not.toBeEmpty();

  await expect(page.getByTestId('signed-in-user-avatar')).toBeVisible();

  await page.getByRole('option', { name: 'Select Community' }).click();
  await page.getByRole('option', { name: 'Sample Community' }).click();

  await expect(
    page
      .getByLabel('Property Table')
      /**
       * To detect if all rows have been propagated in the table, check if a row
       * with attribute `data-list="true"` exists
       */
      .locator('tbody > tr[data-last="true"]')
  ).toBeAttached();
}

/**
 * Select an item within header more menu
 *
 * @example
 *
 * ```ts
 * await headerMoreMenu(page, /Edit Membership Detail/);
 * ```
 */
export async function headerMoreMenu(page: Page, item: string | RegExp) {
  await page.getByLabel('Open Header More Menu').click();
  const menuItem = page
    .getByLabel('Header More Menu')
    .getByRole('menuitem', { name: item });
  await waitUntilStable(menuItem);
  await menuItem.click();
}

/**
 * Select an item within header more menu
 *
 * @example
 *
 * ```ts
 * await headerMoreMenu(page, /Edit Membership Detail/);
 * ```
 */
export async function waitForDialog(page: Page, title: string | RegExp) {
  const modalTitle = page.getByRole('dialog').locator('header');
  await waitUntilStable(modalTitle);
  await expect(modalTitle).toHaveText(title);
}

/**
 * Click a button with the given name
 *
 * @example
 *
 * ```ts
 * await clickButton(page, 'Cancel');
 * ```
 */
export async function clickButton(page: Page, name: string | RegExp) {
  await page.getByRole('button', { name }).click();
}

/**
 * Select an item in selector component
 *
 * @example
 *
 * ```ts
 * await select(page, 'Export Methods', 'Single Sheet');
 * ```
 */
export async function select(
  page: Page,
  selectLabel: string | RegExp,
  selectItem: string | RegExp
) {
  await clickButton(page, selectLabel);
  const item = page.getByRole('option', { name: selectItem });
  await waitUntilStable(item);
  await item.click();
}
