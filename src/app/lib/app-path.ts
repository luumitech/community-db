import { compile } from 'path-to-regexp';
import queryString from 'query-string';

/** List of supported URL within app */
export const supportedPathTemplates = {
  home: '/',
  about: '/about',
  preference: '/preference',
  pricingPlan: '/pricing-plan',
  contactUs: '/contact-us',
  privacy: '/privacy',
  terms: '/terms',
  communityWelcome: '/community',
  communitySelect: '/community/select',
  communityCreate: '/community/create',
  communityImport: '/community/:communityId/import-xlsx',
  communityExport: '/community/:communityId/export-xlsx',
  communityShare: '/community/:communityId/share',
  propertyList: '/community/:communityId/property-list',
  property: '/community/:communityId/property/:propertyId',
  communityDashboard: '/community/:communityId/dashboard',
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
  template:
    | 'communityImport'
    | 'communityExport'
    | 'communityShare'
    | 'propertyList'
    | 'communityDashboard',
  sub: {
    path: {
      communityId: string;
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
  return queryString.stringifyUrl({
    url: toPath(path),
    query,
  });
}

/**
 * Label for various UI endpoints within the app
 *
 * @param template Template name
 * @returns
 */
export function appLabel(template: keyof SupportedPath) {
  switch (template) {
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
    case 'communityShare':
      return 'Share';
    case 'propertyList':
      return 'Property List';
    case 'communityDashboard':
      return 'Dashboard';
    case 'property':
      return 'Property';

    default:
      throw new Error(`unhandled app template ${template}`);
  }
}
