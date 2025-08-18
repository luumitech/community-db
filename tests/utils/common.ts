import { type Locator, type Page } from '@playwright/test';

/**
 * Inspect an element and wait until animation completes
 *
 * @example
 *
 * ```ts
 * const element = page.locator('#element');
 * await waitUntilStable(element);
 * ```
 */
export async function waitUntilStable(locator: Locator) {
  const handle = await locator.elementHandle();
  if (handle) {
    await handle.waitForElementState('stable');
    handle.dispose();
  }
}
