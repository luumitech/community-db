import { PHASE_PRODUCTION_BUILD } from 'next/constants';

/**
 * Utility functions defined here can be used by both server and client code
 *
 * Make sure you don't expose sensitive information through here
 */

export const appTitle = 'Community Database';
export const appDescription =
  'Community Membership Database designed specifically for nonprofits. Easy to use, keep tracks of events and membership information.';

/** List of localstorage keys used to memorize user settings */
export const lsFlags = {
  /** Number of years to show on "Total Membership Counts" bar chart */
  dashboardYearRange: 'cd-dashboard-year-range',
  /** Group by settings in 'Membership Fee' table */
  dashboardMembershipFeeGroupBy: 'cd-dashboard-membership-fee-group-by',
  /** Group by settings in 'Event Ticket Sale' table */
  dashboardEventTicketSaleGroupBy: 'cd-dashboard-event-ticket-sale-group-by',
  /** Reach import dialog for the first time */
  importFirstTime: 'cd-import-first-time',
  /** MapView: show boundary around properties */
  mapViewShowBoundary: 'cd-mapview-show-boundary',
};

/**
 * Is the app in build phase?
 *
 * - I.e. yarn build
 */
export function isBuilding() {
  return process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
}

/** Is the app running in production mode? */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/** Is running Jest or e2e tests */
export function isRunningTest() {
  return (
    process.env.JEST_RUNNING === 'true' ||
    process.env.PLAYWRIGHT_RUNNING === 'true'
  );
}

/** Check if running in server environment (i.e. Node server) */
export function isServer() {
  return typeof window === 'undefined';
}
