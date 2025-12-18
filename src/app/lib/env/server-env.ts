import { jsonc } from 'jsonc';
import { unstable_noStore } from 'next/cache';
import { Logger } from '~/lib/logger';
import { isBuilding } from './';
import { envSchema, type EnvSchema } from './env-schema';

const logger = Logger('server-env');

let _env: EnvSchema | null = null;

/**
 * Return all environment variables (evaluated at runtime)
 *
 * - It also validates process.env against zod schema
 * - Returns environment variable values that are typed
 *
 * @returns Typed environment variable that is evaluated at runtime
 */
export function getEnv(): EnvSchema {
  // Prevent NextJs from caching this function
  unstable_noStore();

  if (isBuilding()) {
    return envSchema.parse(process.env);
  }

  // During runtime, we only want to verify env var against schema once
  if (_env == null) {
    _env = envSchema.parse(process.env);

    if (_env.CONFIG_DEBUG) {
      logger.info(jsonc.stringify(_env, undefined, 2));
    }
  }

  return _env;
}

/**
 * Return environment variables of a specific key
 *
 * @returns Typed environment variable that is evaluated at runtime
 */
export function env<K extends keyof EnvSchema>(key: K): EnvSchema[K] {
  const envObj = getEnv();
  return envObj[key];
}
