import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';
import { appPath } from '~/lib/app-path';
import { urlJoin } from '~/lib/url-util';

/**
 * List of path prefixes that requires user to be logged in to access
 *
 * - Don't need to include graphql paths here because graphql APIs has its own
 *   logic to handle route protection. See: `src/app/graphql/context.ts`
 */
const protectedPaths = [
  '/community',
  appPath('userProfile'),
  /**
   * API route handlers (for routes requiring auth)
   *
   * - Don't protect uploadthing, as it has its own authentication layer
   */
  // '/api/uploadthing',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = protectedPaths.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedPath) {
    const sessionCookie = getSessionCookie(request);

    // Auth fails if session token is not available
    if (!sessionCookie) {
      const origin = request.nextUrl.origin;
      const homeURL = urlJoin(origin, {
        paths: appPath('home'),
        // Add callback, to redirect to this page after login
        query: { callbackUrl: pathname },
      });
      return NextResponse.redirect(homeURL);
    }
  }
}
