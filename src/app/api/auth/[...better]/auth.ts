import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { env } from '~/lib/env-cfg';
import { appTitle, isProduction, isRunningTest } from '~/lib/env-var';
import prisma from '~/lib/prisma';
import { sendVerificationOTP } from './email-otp';

export const auth = betterAuth({
  appName: appTitle,
  database: prismaAdapter(prisma, { provider: 'mongodb' }),
  advanced: {
    database: {
      // Let mongo generate ID automatically
      generateId: false,
    },
  },
  user: {
    // By default, better-auth uses 'User' as the model name, but we are
    // already using that database to keep track of active user profile.
    modelName: 'AuthUser',
  },
  session: {
    cookieCache: {
      enabled: true,
      // 10 minutes (in seconds)
      maxAge: 10 * 60,
    },
  },
  account: {
    accountLinking: {
      /**
       * Forced Linking
       *
       * Allow login via other providers with same email address
       *
       * See:
       * https://www.better-auth.com/docs/concepts/users-accounts#forced-linking
       */
      enabled: true,
    },
  },
  emailAndPassword: {
    /**
     * Allow email/password login in development mode only.
     *
     * - Allow arbitrary username and password.
     */
    enabled: !isProduction() || isRunningTest(),
    password: {
      // Skip password verification during testing
      verify: async () => true,
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        /**
         * Facebook is not returning the `emailVerified` flag in user profile,
         * so we add it manually
         */
        return {
          email: profile.email,
          emailVerified: true,
          name: profile.name,
          image: profile.picture.data.url,
        };
      },
    },
    twitter: {
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    },
  },
  plugins: [
    /**
     * The Email OTP plugin allows user to sign in, verify their email, or reset
     * their password using a one-time password (OTP) sent to their email
     * address.
     *
     * See: https://www.better-auth.com/docs/plugins/email-otp
     */
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      sendVerificationOTP,
    }),
  ],
});

/** Get current session, by decrypting the session token held in cookie */
export async function getServerSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  return session;
}
