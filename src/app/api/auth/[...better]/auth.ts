import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { headers } from 'next/headers';
import { env } from '~/lib/env-cfg';
import { isProduction } from '~/lib/env-var';
import prisma from '~/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'mongodb' }),
  advanced: {
    database: {
      // Let mongo generate ID automatically
      generateId: false,
    },
  },
  // Development only, allow user to login with arbitrary
  // username and password.
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});

/** Get current session */
export async function getServerSession() {
  const session = await auth.api.getSession({ headers: headers() });
  return session;
}
