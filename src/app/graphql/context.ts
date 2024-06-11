import { GraphQLError } from 'graphql';
import type { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import prisma from '../lib/prisma';
import { pubSub } from './pubsub';

export async function createContext(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(authOptions);

  // All graphQL operations require user to be authenticated
  if (!session) {
    throw new GraphQLError('You are not authenticated');
  }

  const { user } = session;
  if (!user) {
    throw new GraphQLError('Auth: Missing user context');
  }
  const { email } = user;
  if (!email) {
    throw new GraphQLError('Auth: Missing email in user context');
  }
  return {
    // Email is always available in user context
    user: { ...user, email },
    pubSub,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
