import { compile } from 'path-to-regexp';

/**
 * List of supported URL within app
 */
const supportedPathTemplates = {
  home: '/',
  preference: '/preference',
  communityWelcome: '/community',
  communitySelect: '/community/select',
  communityCreate: '/community/create',
  communityImport: '/community/:communityId/management/import-xlsx',
  communityExport: '/community/:communityId/management/export-xlsx',
  communityShare: '/community/:communityId/management/share',
  propertyList: '/community/:communityId/editor/property-list',
  property: '/community/:communityId/editor/property/:propertyId',
  communityToolMenu: '/community/:communityId/tool/menu',
  communityDashboard: '/community/:communityId/tool/dashboard',
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
    | 'communityToolMenu'
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
