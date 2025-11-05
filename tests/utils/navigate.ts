import { expect, type Page } from '@playwright/test';
import { waitUntilStable } from './common';

/**
 * Navigate to the property list page
 *
 * - Navigate from `/community`
 */
export async function navigatePropertyList(page: Page) {
  await page.goto('/community');
  await expect(page.getByText('Welcome')).not.toBeEmpty();

  await expect(page.getByTestId('signed-in-user-avatar')).toBeVisible();

  await page.getByRole('link', { name: 'Select Community' }).click();
  await page.getByRole('option', { name: 'Sample Community' }).click();

  const rows = page.getByLabel('Property Table').getByRole('row');
  await expect(rows.first()).toBeVisible();
}

/**
 * Navigate to the property page
 *
 * - Navigate from `/community`
 */
export async function navigateProperty(page: Page, address: string) {
  await navigatePropertyList(page);

  // Go to address matching input
  const matchingRow = page
    .getByLabel('Property Table')
    .getByRole('row')
    .filter({
      // Get the row matching the input address
      hasText: address,
    })
    .first();
  await waitUntilStable(matchingRow);
  await matchingRow.click();
  await expect(page.getByText('Membership Status')).not.toBeEmpty();
}

/**
 * Use this function to verify transaction details
 *
 * - Navigate from `/community/[communityId]/property/[propertyId]/view`
 */
export async function navigateRegisterEvent(page: Page, currentEvent: string) {
  await expect(
    page.locator('main').getByText('Current Event', { exact: true })
  ).not.toBeEmpty();
  const button = page.getByRole('button', { name: "I'm here!" });
  if (await button.isDisabled()) {
    await select(page, 'Current Event Name', currentEvent);
  }
  await button.click();
  await waitForDialog(page, 'Register Event');
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
 * Enter text into input field
 *
 * @example
 *
 * ```ts
 * await fillInput(page, 'Ticket #', '1');
 * ```
 */
export async function fillInput(
  page: Page,
  label: string | RegExp,
  value: string
) {
  const input = page.getByLabel(label);
  input.fill(value);
  /**
   * If there is validation error on the input field, this will trigger react
   * hook form to revalidate the field
   */
  input.press('Tab');
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
  /**
   * Within event register modal, the following code didn't work for whatever
   * reason, so we use another workaround
   *
   * ```ts
   * const item = page.getByRole('option', { name: selectItem });
   * ```
   */
  const item = page
    .locator('ul[role="listbox"] > li')
    .filter({ hasText: selectItem });
  await waitUntilStable(item);
  await item.click();
}

/**
 * Select an item within the <Dropdown/> component
 *
 * @example
 *
 * ```ts
 * await selectDropdown(page, 'Add Ticket', 'meal');
 * ```
 */
export async function selectDropdown(
  page: Page,
  label: string | RegExp,
  itemName: string | RegExp
) {
  await clickButton(page, label);
  /**
   * Within event register modal, the following code didn't work for whatever
   * reason, so we use another workaround
   *
   * ```ts
   * const menuItem = page.getByRole('menuitem', { name: selectItem });
   * ```
   */
  const menuItem = page
    .locator('ul[role="menu"] > li')
    .filter({ hasText: itemName });
  await waitUntilStable(menuItem);
  await menuItem.click();
}
