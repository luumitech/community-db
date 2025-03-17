import type { NextMiddlewareResult } from 'next/dist/server/web/types';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

/**
 * Middleware factory function signature
 *
 * - Can be used to install a custom middleware into part of the chain
 */
export type MiddlewareFactory = (
  middleware: CustomMiddleware
) => CustomMiddleware;

export function chain(
  functions: MiddlewareFactory[],
  index = 0
): CustomMiddleware {
  const current = functions[index];

  if (current) {
    const next = chain(functions, index + 1);
    return current(next);
  }

  return (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    return response;
  };
}
