import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { headers } from 'next/headers';
import { env } from '~/lib/env-cfg';
import { appTitle, isProduction, isRunningTest } from '~/lib/env-var';
import prisma from '~/lib/prisma';

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
  // Development only, allow user to login with arbitrary
  // username and password.
  emailAndPassword: {
    enabled: !isProduction() || isRunningTest(),
    password: {
      // Skip password verification during testing
      verify: async () => true,
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
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
      async sendVerificationOTP({ email, otp, type }) {
        console.log({ email, otp, type });
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
      },
    }),
  ],
});

/** Get current session */
export async function getServerSession() {
  const session = await auth.api.getSession({ headers: headers() });
  return session;
}
