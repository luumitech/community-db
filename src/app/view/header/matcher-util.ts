import { match } from 'path-to-regexp';
import { supportedPathTemplates } from '~/lib/app-path';

/**
 * Check if pathname matches the community editor path
 */
export function matchCommunityEditor(pathname: string) {
  const isPropertyEditor = match<{ communityId: string; propertyId: string }>(
    supportedPathTemplates.property,
    { decode: decodeURIComponent }
  );
  const isPropertyList = match<{ communityId: string }>(
    supportedPathTemplates.propertyList,
    { decode: decodeURIComponent }
  );
  return isPropertyEditor(pathname) || isPropertyList(pathname);
}
