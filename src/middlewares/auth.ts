import { getSessionCookie } from 'better-auth/cookies';
import { env } from 'next-runtime-env';
import { NextResponse } from 'next/server';
import { appPath } from '~/lib/app-path';
import { urlJoin } from '~/lib/url-util';
import type { MiddlewareFactory } from './chain';

const protectedPaths = [
  '/community',
  // API route handlers (for routes requiring auth)
  // Don't protect uploadthing, as it has its own authentication layer
  // '/api/uploadthing',
];

export const authMiddleware: MiddlewareFactory =
  (next) => async (request, event, response) => {
    const { pathname } = request.nextUrl;

    const isProtectedPath = protectedPaths.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (isProtectedPath) {
      const sessionCookie = getSessionCookie(request);

      // Auth fails if session token is not available
      if (!sessionCookie) {
        const baseURL = env('NEXT_PUBLIC_HOSTNAME')!;
        const homeURL = urlJoin(baseURL, {
          paths: appPath('home'),
          // Add callback, to redirect to this page after login
          query: { callbackUrl: pathname },
        });
        return NextResponse.redirect(homeURL);
      }
    }

    // Call next middleware
    return next(request, event, response);
  };
