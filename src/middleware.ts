import { withAuth } from 'next-auth/middleware';

/**
 * List of routes that need to be authenticated
 * Matcher expression uses path-to-regexp:
 * See: https://github.com/pillarjs/path-to-regexp
 */
export const config = { matcher: ['/community(.*)'] };

export default withAuth({
  // For more detail
  // See: https://next-auth.js.org/configuration/nextjs#pages
  pages: {
    // When auth fails, redirect to this page
    signIn: '/',
  },
});
