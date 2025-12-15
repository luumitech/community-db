import { StatusCodes } from 'http-status-codes';
import * as R from 'remeda';
import { nextPublicSchema } from '~/lib/env/env-schema';
import { getEnv } from '~/lib/env/server-env';
import { Logger } from '~/lib/logger';
import type { SInput, SOutput } from './contract';

const logger = Logger('/sample');

/**
 * NextJS allows you to access `process.env.NEXT_PUBLIC_*` env var on client
 * side, however, the values will be replaced with actual value at build time.
 *
 * If you want the access the run time value on the client, use this API to read
 * the env var.. This works because the env vars are processed at runtime on the
 * server side.
 */
export async function env(req: SInput): Promise<SOutput> {
  const envObj = getEnv();

  const nextPublicEnvKeys = nextPublicSchema.keyof().options;
  const nextPublicEnv = R.pick(envObj, nextPublicEnvKeys);

  return {
    status: StatusCodes.OK,
    body: nextPublicEnv,
  };
}
