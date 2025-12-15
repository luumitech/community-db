import { StatusCodes } from 'http-status-codes';
import { env as envVar } from '~/lib/env/server-env';
import { Logger } from '~/lib/logger';
import type { SInput, SOutput } from './contract';

const logger = Logger('/sample');

/**
 * By default, reading NEXT_PUBLIC env var directly on client side will retrieve
 * its value during build time.
 *
 * If you want to read NEXT_PUBLIC env var in runtime, then use this API
 */
export async function env(req: SInput): Promise<SOutput> {
  const { name } = req.query;

  if (!name.startsWith('NEXT_PUBLIC')) {
    throw new Error('Can only retrieve NEXT_PUBLIC env vars');
  }
  const envValue = envVar(name)?.toString();

  return {
    status: StatusCodes.OK,
    body: envValue ?? '',
  };
}
