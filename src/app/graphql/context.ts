import { GraphQLError } from 'graphql';
import { type YogaInitialContext } from 'graphql-yoga';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import prisma from '../lib/prisma';
import { pubSub } from './pubsub';

export async function createContext(ctx: YogaInitialContext) {
  const session = await getServerSession(authOptions);

  // All graphQL operations require user to be authenticated
  if (!session) {
    throw new GraphQLError('You are not authenticated');
  }

  const { user } = session;
  if (!user) {
    throw new GraphQLError('Auth: Missing user context');
  }
  const { uid } = user;
  if (!uid) {
    throw new GraphQLError('Auth: Missing uid in user context');
  }
  return {
    user,
    pubSub,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
