import { getSessionCookie } from 'better-auth/cookies';
import { env } from 'next-runtime-env';
import { NextResponse } from 'next/server';
import { appPath } from '~/lib/app-path';
import type { MiddlewareFactory } from './chain';

const protectedPaths = [
  '/community',
  // '/preference',
  // API route handlers
  '/api/sample',
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
        const baseURL = env('NEXT_PUBLIC_HOSTNAME');
        const homeURL = appPath('home', {
          // Add callback, to redirect to this page after login
          query: { callbackUrl: `${baseURL}/${pathname}` },
        });
        return NextResponse.redirect(new URL(homeURL, baseURL));
      }
    }

    // Call next middleware
    return next(request, event, response);
  };
