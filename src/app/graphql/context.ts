import { type YogaInitialContext } from 'graphql-yoga';
import { type NextRequest } from 'next/server';
import { contextUser } from '~/lib/context-user';
import { JobHandler } from '~/lib/job-handler';
import { pubSub } from './pubsub';

interface YogaServerContext extends YogaInitialContext {
  request: NextRequest;
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(/, /)[0];
  return ip ?? '127.0.0.1';
}

export async function createContext(ctx: YogaServerContext) {
  const req = ctx.request;
  const user = await contextUser(req.headers);
  const jobHandler = await JobHandler.init();

  return {
    user,
    pubSub,
    jobHandler,
    clientIp: getClientIp(req),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
