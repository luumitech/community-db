import { type Page } from '@playwright/test';
import path from 'path';

/**
 * Save screenshots in a dedicated folder within the app directory
 *
 * - This is used for display screenshots in the landing page
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(
      process.cwd(),
      'src',
      'app',
      'view',
      'landing',
      'images',
      `${name}.png`
    ),
  });
}
