import NextAuth, {
  type DefaultSession,
  type Profile as NextProfile,
} from 'next-auth';

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

  interface Profile extends NextProfile {
    /**
     * Google returns a email_verified to indicate if email is verified
     */
    email_verified?: boolean;
  }
}
