import NextAuth, { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop
   * on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /**
       * Email is a required field in session user object
       */
      email: string;
    } & DefaultSession['user'];
  }
}
