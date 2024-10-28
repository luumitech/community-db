import { compile } from 'path-to-regexp';

/** List of supported URL within app */
export const supportedPathTemplates = {
  home: '/',
  about: '/about',
  preference: '/preference',
  pricing: '/pricing',
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
 * @param sub Path substitution variable
 * @returns
 */
export function appPath(
  template:
    | 'home'
    | 'about'
    | 'preference'
    | 'pricing'
    | 'communityWelcome'
    | 'communitySelect'
    | 'communityCreate'
): string;
export function appPath(
  template:
    | 'communityImport'
    | 'communityExport'
    | 'communityShare'
    | 'propertyList'
    | 'communityDashboard',
  sub: { communityId: string }
): string;
export function appPath(
  template: 'property',
  sub: {
    communityId: string;
    propertyId: string;
  }
): string;
export function appPath(
  template: keyof SupportedPath,
  sub?: Record<string, string>
) {
  const toPath = compile(supportedPathTemplates[template], {
    encode: encodeURIComponent,
  });
  return toPath(sub);
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
    case 'preference':
      return 'Preference';
    case 'pricing':
      return 'Change your plan';
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
