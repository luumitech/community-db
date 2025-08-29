import path from 'path';

/**
 * File for storing authentication state and other states.
 *
 * This is used in playwright.config.ts
 */
export const SETUP_FILE = path.join(process.cwd(), 'playwright', '.setup.json');
