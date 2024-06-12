import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '~/lib/env-cfg';

export const authOptions: AuthOptions = {
  providers: [GoogleProvider(env.google)],
  callbacks: {
    async session({ session, token, user }) {
      return {
        ...session,
        // Send a little more user information back
        user: {
          ...session.user,
          uid: token.sub,
        },
      };
    },
  },
};
