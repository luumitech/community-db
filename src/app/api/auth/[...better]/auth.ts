import { betterAuth, type User } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';
import { emailOTP, openAPI } from 'better-auth/plugins';
import { env } from '~/lib/env-cfg';
import { appTitle, isProduction, isRunningTest } from '~/lib/env-var';
import { insertIf } from '~/lib/insert-if';
import prisma from '~/lib/prisma';
import * as deleteUserUtil from './delete-user-util';
import { sendVerificationOTP } from './email-otp';

// Development mode (or running tests)
const isDev = !isProduction() || isRunningTest();

export const auth = betterAuth({
  appName: appTitle,
  database: prismaAdapter(prisma, { provider: 'mongodb' }),
  advanced: {
    database: {
      // Let mongo generate ID automatically
      generateId: false,
    },
    /**
     * By default, better-auth enforces origin header, but we don't want to do
     * this during development mode (i.e. running tests)
     *
     * See: https://github.com/better-auth/better-auth/issues/5536
     */
    disableOriginCheck: isDev,
  },
  user: {
    // By default, better-auth uses 'User' as the model name, but we are
    // already using that database to keep track of active user profile.
    modelName: 'AuthUser',
    /**
     * Allow user to be deleted. expose `authClient.deleteUser` API
     *
     * See: https://www.better-auth.com/docs/concepts/users-accounts#delete-user
     */
    deleteUser: {
      enabled: true,
      beforeDelete: beforeUserDelete,
      afterDelete: afterUserDelete,
    },
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
    enabled: isDev,
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
    /**
     * To view the OPEN API reference, go to URL:
     *
     *     http://localhost:3000/api/auth/reference
     */
    ...insertIf(isDev, openAPI()),
  ],
});

/** Get current session, by decrypting the session token held in cookie */
export async function getServerSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  return session;
}

/**
 * Get User Document using information from better-auth user
 *
 * @param authUser Better-auth user context
 * @returns User document
 */
async function getUser(authUser: User) {
  const { email } = authUser;
  if (!email) {
    throw new APIError('BAD_REQUEST', {
      message: 'User account does not have a valid email',
    });
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new APIError('BAD_REQUEST', {
      message: 'User account does not exist',
    });
  }
  return user;
}

/**
 * Pre-requisite check before allowing user account to be deleted
 *
 * - To interrupt with error you can throw `APIError`
 */
async function beforeUserDelete(authUser: User, req?: Request) {
  const user = await getUser(authUser);
  const communities = await deleteUserUtil.communityNonOwnerSoleAdministrator(
    user.id
  );
  if (communities.length > 0) {
    throw new APIError('BAD_REQUEST', {
      message: [
        'You must assign the administrator role to someone else to the following communities:',
        ...communities.map(({ name }) => `- ${name}`),
        'before your account can be deleted',
      ].join('\n'),
    });
  }
}

/**
 * Perform clean up of user account
 *
 * - To interrupt with error you can throw `APIError`
 */
async function afterUserDelete(authUser: User, req?: Request) {
  const user = await getUser(authUser);
  await deleteUserUtil.performUserDelete(user.id);
}
