export const appTitle = 'Community Database';

/** Is the app running in production mode? */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/** Is running Jest or Cypress tests */
export function isRunningTest() {
  return (
    process.env.JEST_RUNNING === 'true' ||
    process.env.CYPRESS_RUNNING === 'true'
  );
}

/** Check if running in server environment (i.e. Node server) */
export function isServer() {
  return typeof window === 'undefined';
}
