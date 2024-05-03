import type { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import prisma from '../lib/prisma';

export async function createContext(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(authOptions);

  // All graphQL operations require user to be authenticated
  if (!session) {
    throw new Error('You are not authenticated');
  }

  const { user } = session;
  if (!user) {
    throw new Error('Missing user context');
  }
  const { email } = user;
  if (!email) {
    throw new Error('Missing email in user context');
  }
  return {
    // Email is always available in user context
    user: { ...user, email },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
