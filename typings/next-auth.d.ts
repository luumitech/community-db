import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop
   * on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      // Default fields provided by nextAuth
      name?: string | null;
      image?: string | null;
      email: string;
      /**
       * unique user ID (must be available in user context)
       */
      uid: string;
    };
  }
}
