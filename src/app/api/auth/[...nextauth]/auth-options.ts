import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '~/lib/env-cfg';

export const authOptions: AuthOptions = {
  providers: [GoogleProvider(env.google)],
  callbacks: {
    async session({ session, token, user }) {
      if (!session.user.email) {
        throw new Error('email missing in session');
      }

      return session;
    },
  },
};
