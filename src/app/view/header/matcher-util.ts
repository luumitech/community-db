import { match } from 'path-to-regexp';

export function matchCommunity(pathname: string) {
  const matcher = match<{ communityId: string }>(
    '/community/:communityId/(.*)',
    { decode: decodeURIComponent }
  );
  return matcher(pathname);
}

/**
 * Check if pathname matches the community editor path
 */
export function matchCommunityEditor(pathname: string) {
  const matcher = match<{ communityId: string }>(
    '/community/:communityId/editor/(.*)',
    { decode: decodeURIComponent }
  );
  return matcher(pathname);
}
