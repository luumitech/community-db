import { compile } from 'path-to-regexp';
import queryString from 'query-string';

const SPECIFIC_COMMUNITY_PATH = '/community/:communityId';
const SPECIFIC_PROPERTY_PATH = `${SPECIFIC_COMMUNITY_PATH}/property/:propertyId`;

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

  communityImport: `${SPECIFIC_COMMUNITY_PATH}/import-community`,
  communityExport: `${SPECIFIC_COMMUNITY_PATH}/export-xlsx`,
  contactExport: `${SPECIFIC_COMMUNITY_PATH}/export-contact`,
  communityShare: `${SPECIFIC_COMMUNITY_PATH}/share`,
  propertyList: `${SPECIFIC_COMMUNITY_PATH}/property-list`,
  communityDashboard: `${SPECIFIC_COMMUNITY_PATH}/dashboard`,
  thirdPartyIntegration: `${SPECIFIC_COMMUNITY_PATH}/third-party-integration`,
  communityMapView: `${SPECIFIC_COMMUNITY_PATH}/map-view`,
  batchPropertyModify: `${SPECIFIC_COMMUNITY_PATH}/batch-property-modify`,
  communityModify: `${SPECIFIC_COMMUNITY_PATH}/community-modify`,
  communityDelete: `${SPECIFIC_COMMUNITY_PATH}/community-delete`,
  propertyCreate: `${SPECIFIC_COMMUNITY_PATH}/property-create`,

  property: `${SPECIFIC_PROPERTY_PATH}/view`,
  propertyModify: `${SPECIFIC_PROPERTY_PATH}/property-modify`,
  propertyDelete: `${SPECIFIC_PROPERTY_PATH}/property-delete`,
  membershipEditor: `${SPECIFIC_PROPERTY_PATH}/membership-editor`,
  occupantEditor: `${SPECIFIC_PROPERTY_PATH}/occupant-editor`,
  registerEvent: `${SPECIFIC_PROPERTY_PATH}/register-event`,
  composeMembershipMail: `${SPECIFIC_PROPERTY_PATH}/compose-membership-mail`,
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
    | 'communityMapView'
    | 'batchPropertyModify'
    | 'communityDelete'
    | 'propertyCreate',
  sub: {
    path: {
      communityId: string;
    };
  }
): string;
export function appPath(
  template: 'communityModify',
  sub: {
    path: {
      communityId: string;
    };
    query?: {
      tab?: 'general' | 'events' | 'tickets' | 'paymentMethods';
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
  template: 'property' | 'propertyModify' | 'propertyDelete' | 'occupantEditor',
  sub: {
    path: {
      communityId: string;
      propertyId: string;
    };
  }
): string;
export function appPath(
  template: 'membershipEditor',
  sub: {
    path: {
      communityId: string;
      propertyId: string;
    };
    query?: {
      autoFocus?: 'notes-helper';
    };
  }
): string;
export function appPath(
  template: 'registerEvent',
  sub: {
    path: {
      communityId: string;
      propertyId: string;
    };
    query: {
      eventName: string;
    };
  }
): string;
export function appPath(
  template: 'composeMembershipMail',
  sub: {
    path: {
      communityId: string;
      propertyId: string;
    };
    query: {
      membershipYear: string;
    };
  }
): string;
export function appPath(
  template: keyof SupportedPath,
  sub?: {
    path?: Record<string, string>;
    query?: Record<string, string>;
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
export function appLabel(key: keyof SupportedPath) {
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
    case 'batchPropertyModify':
      return 'Batch Modify Property';
    case 'communityModify':
      return 'Community Settings';
    case 'communityDelete':
      return 'Delete Community';
    case 'propertyCreate':
      return 'Create Property';
    case 'propertyModify':
      return 'Modify Property';
    case 'propertyDelete':
      return 'Delete Property';
    case 'membershipEditor':
      return 'Edit Membership Detail';
    case 'occupantEditor':
      return 'Edit Contact Information';
    case 'registerEvent':
      return 'Register Event';
    case 'composeMembershipMail':
      return 'Compose Confirmation Email';
    case 'property':
      return 'View Property';
    case 'thirdPartyIntegration':
      return 'Third-Party Integration';
    case 'communityMapView':
      return 'Map View';

    default:
      throw new Error(`unhandled app key ${key}`);
  }
}
