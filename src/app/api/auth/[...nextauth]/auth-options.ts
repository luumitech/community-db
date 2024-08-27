import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '~/lib/env-cfg';

export const authOptions: AuthOptions = {
  providers: [GoogleProvider(env().google)],
  callbacks: {
    async signIn({ account, profile }) {
      switch (account?.provider) {
        case 'google':
          // Only allow verified email to login
          return !!profile?.email_verified;
      }
      return true;
    },
    async session({ session, token, user }) {
      if (!session.user.email) {
        throw new Error('email missing in session');
      }

      return session;
    },
  },
  // pages: {
  //   signIn: '/sign-in',
  // },
  theme: {
    logo: '/image/community-db-logo.png',
  },
};
