import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '~/lib/env-cfg';
import { isProduction } from '~/lib/env-var';
import { insertIf } from '~/lib/insert-if';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // Development only, allow user to login with arbitrary
    // username and password.
    ...insertIf(
      !isProduction(),
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'dev' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials, req) {
          return {
            id: '1',
            name: 'Dev User',
            email: 'devuser@email.com',
          };
        },
      })
    ),
  ],
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
