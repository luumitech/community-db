import { StatusCodes } from 'http-status-codes';
import { headers } from 'next/headers';
import { getServerSession } from '~/api/auth/[...better]/auth';
import { Logger } from '~/lib/logger';
import type { SInput, SOutput } from './contract';

const logger = Logger('/sample');

/**
 * Sample API
 *
 * For demonstration purpose only
 */
export async function sample(req: SInput): Promise<SOutput> {
  const { input } = req.query;

  /**
   * This is a public API, so you can call it without authentication.
   *
   * I.e. the session could be null
   */
  const session = await getServerSession(headers());

  return {
    status: StatusCodes.OK,
    body: input ?? 'n/a',
  };
}
