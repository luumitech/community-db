import { type YogaInitialContext } from 'graphql-yoga';
import { contextUser } from '~/lib/context-user';
import { pubSub } from './pubsub';

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(/, /)[0];
  return ip ?? '127.0.0.1';
}

export async function createContext(ctx: YogaInitialContext) {
  const user = await contextUser();

  const req = ctx.request;
  return {
    user,
    pubSub,
    clientIp: getClientIp(req),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
