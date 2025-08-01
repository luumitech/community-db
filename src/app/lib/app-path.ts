import { compile } from 'path-to-regexp';
import queryString from 'query-string';

/** List of supported modal routes and its corresponding label */
const supportedModals = {
  communityModify: 'Community Settings',
  communityDelete: 'Delete Community',
  propertyCreate: 'Create Property',
  propertyModify: 'Modify Property',
  propertyDelete: 'Delete Property',
  batchPropertyModify: 'Batch Modify Property',
  membershipEditor: 'Edit Membership Detail',
  occupantEditor: 'Edit Contact Information',
  eventRegister: 'Register Event',
};
type SupportedModal = typeof supportedModals;

/** List of supported URL within app */
export const supportedPathTemplates = {
  home: '/',
  signIn: '/sign-in',
  about: '/about',
  preference: '/preference',
  tutorial: '/tutorial{/:guide}',
  pricingPlan: '/pricing-plan',
  contactUs: '/contact-us',
  privacy: '/privacy',
  terms: '/terms',
  communityWelcome: '/community',
  communitySelect: '/community/select',
  communityCreate: '/community/create',
  communityImport: '/community/:communityId/import-xlsx',
  communityExport: '/community/:communityId/export-xlsx',
  contactExport: '/community/:communityId/export-contact',
  communityShare: '/community/:communityId/share',
  propertyList: '/community/:communityId/property-list',
  property: '/community/:communityId/property/:propertyId',
  communityDashboard: '/community/:communityId/dashboard',
  thirdPartyIntegration: '/community/:communityId/third-party-integration',
  communityMapView: '/community/:communityId/map-view',
};
type SupportedPath = typeof supportedPathTemplates;

/**
 * Generate URL for various UI endpoints within the app
 *
 * @param template Template name
 * @param sub Path/query substitution variable(s)
 * @returns
 */
export function appPath(
  template:
    | 'home'
    | 'signIn'
    | 'about'
    | 'privacy'
    | 'terms'
    | 'preference'
    | 'pricingPlan'
    | 'communityWelcome'
    | 'communitySelect'
    | 'communityCreate'
): string;
export function appPath(
  template: 'home' | 'signIn',
  sub?: {
    query?: {
      callbackUrl?: string;
    };
  }
): string;
export function appPath(
  template: 'contactUs',
  sub?: {
    query?: {
      title?: string;
      subject?: string;
      /** Additional helper text to help user compose message */
      messageDescription?: string;
      /** Enable server log */
      log?: string;
    };
  }
): string;
export function appPath(
  template: 'tutorial',
  sub?: {
    path?: {
      guide?: string;
    };
  }
): string;
export function appPath(
  template:
    | 'communityImport'
    | 'communityExport'
    | 'contactExport'
    | 'communityShare'
    | 'propertyList'
    | 'communityDashboard'
    | 'communityMapView',
  sub: {
    path: {
      communityId: string;
    };
  }
): string;
export function appPath(
  template: 'thirdPartyIntegration',
  sub: {
    path: {
      communityId: string;
    };
    query?: {
      tab?: 'mailchimp' | 'geoapify';
    };
  }
): string;
export function appPath(
  template: 'property',
  sub: {
    path: {
      communityId: string;
      propertyId: string;
    };
  }
): string;
export function appPath(
  template: keyof SupportedPath,
  sub?: {
    query?: Record<string, string>;
    path?: Record<string, string>;
  }
) {
  const { query, path } = sub ?? {};
  const pathTemplate = supportedPathTemplates[template];
  const toPath = compile(pathTemplate, { encode: encodeURIComponent });
  const url = toPath(path);
  return queryString.stringifyUrl({ url, query });
}

/**
 * Label for various UI endpoints within the app
 *
 * @param key Key for representing modal/route within the app
 * @returns Human readable label represented by the key
 */
export function appLabel(key: keyof SupportedPath | keyof SupportedModal) {
  switch (key) {
    case 'home':
      return 'Home';
    case 'about':
      return 'About';
    case 'privacy':
      return 'Privacy';
    case 'terms':
      return 'Terms';
    case 'preference':
      return 'Preference';
    case 'tutorial':
      return 'Tutorial';
    case 'pricingPlan':
      return 'Pricing Plan';
    case 'contactUs':
      return 'Contact Us';
    case 'communityWelcome':
      return 'Welcome';
    case 'communitySelect':
      return 'Select Community';
    case 'communityCreate':
      return 'Create New Community';
    case 'communityImport':
      return 'Import Community';
    case 'communityExport':
      return 'Export to Excel';
    case 'contactExport':
      return 'Export Contacts';
    case 'communityShare':
      return 'Share';
    case 'propertyList':
      return 'Property List';
    case 'communityDashboard':
      return 'Dashboard';
    case 'property':
      return 'Property';
    case 'thirdPartyIntegration':
      return 'Third-Party Integration';
    case 'communityMapView':
      return 'Map View';

    default:
      if (Object.hasOwn(supportedModals, key)) {
        return supportedModals[key as keyof SupportedModal];
      }
      throw new Error(`unhandled app key ${key}`);
  }
}
