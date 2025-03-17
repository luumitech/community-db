import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware';
import type { MiddlewareFactory } from './chain';

const protectedPaths = [
  '/community',
  '/preference',
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
      const mw = withAuth({
        // For more detail
        // See: https://next-auth.js.org/configuration/nextjs#pages
        pages: {
          // When auth fails, redirect to this page
          signIn: '/',
        },
      });
      return mw(request as NextRequestWithAuth, event);
    }

    // Call next middleware
    return next(request, event, response);
  };
