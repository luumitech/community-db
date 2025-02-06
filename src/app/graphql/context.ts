import { GraphQLError } from 'graphql';
import { type YogaInitialContext } from 'graphql-yoga';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import { pubSub } from './pubsub';

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(/, /)[0];
  return ip ?? '127.0.0.1';
}

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
  const { email } = user;
  if (!email) {
    throw new GraphQLError('Auth: Missing email in user context');
  }

  const req = ctx.request;
  return {
    user,
    pubSub,
    clientIp: getClientIp(req),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
