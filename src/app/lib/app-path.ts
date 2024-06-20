import { compile } from 'path-to-regexp';

/**
 * List of supported URL within app
 */
export const supportedPathTemplates = {
  home: '/',
  preference: '/preference',
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
 * @param template template name
 * @param sub path substitution variable
 * @returns
 */
export function appPath(
  template:
    | 'home'
    | 'preference'
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
