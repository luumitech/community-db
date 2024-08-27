import { unstable_noStore } from 'next/cache';
import OmniConfig from 'omniconfig.js';
import * as yup from 'yup';
import { Logger } from '~/lib/logger';

const logger = Logger('env-cfg');

/**
 * Check a list of env variables that must be present for the application to
 * work properly
 *
 * These are mapped from environment variables in `process.env` And snake case
 * names can be automatically mapped to object form.
 */
const schema = yup.object({
  NODE_ENV: yup.string().oneOf(['development', 'production']).required(),

  // Basepath used by client to construct URL (do not add slash at end)
  // protocol://hostname:port
  NEXT_PUBLIC_HOSTNAME: yup.string().required(),

  // App version information
  NEXT_PUBLIC_APP_VERSION: yup.string(),
  NEXT_PUBLIC_GIT_BRANCH: yup.string(),
  NEXT_PUBLIC_GIT_COMMIT_HASH: yup.string(),

  // See: https://next-auth.js.org/configuration/options#nextauth_secret
  NEXTAUTH_SECRET: yup.string().required(),

  // Jest would set this to 'true' if jest is running
  JEST_RUNNING: yup.string(),

  // Log configuration
  log: yup.object({
    debug: yup.string(),
  }),

  config: yup.object({
    debug: yup.boolean(),
  }),

  // For google login
  // Options passed into GoogleProvider from 'next-auth/providers/google';
  google: yup.object({
    clientId: yup.string().required(),
    clientSecret: yup.string().required(),
  }),

  // Mongo configuration
  mongodb: yup.object({
    uri: yup.string().required(),
  }),

  // Azure configuration
  azure: yup.object({
    storageMode: yup.string().oneOf(['local', 'remote', 'none']),
    /** Local azurite configuration */
    localStorage: yup
      .object({
        host: yup.string().required(),
        port: yup.number().required(),
        account: yup.string().required(),
        accountKey: yup.string().required(),
      })
      .default(undefined)
      .when('storageMode', {
        is: 'local',
        then: (_schema) => _schema.default({}),
      }),

    /** Remote azure blob storage configuration */
    storage: yup
      .object({
        account: yup.string().required(),
        accountKey: yup.string().required(),
      })
      .default(undefined)
      .when('storageMode', {
        is: 'remote',
        then: (_schema) => _schema.default({}),
      }),
  }),
});

/** Copy of env that has gone through schema validation */
let verifiedEnv: (typeof schema)['__outputType'] | undefined;

/**
 * Return environment variables
 *
 * - Check with schema to ensure all env var values adhere to schema
 */
export function env() {
  // Prevent NextJs from caching this function
  unstable_noStore();

  if (verifiedEnv == null) {
    verifiedEnv = OmniConfig.withYup(schema)
      .useEnvironmentVariables({ processEnv: true })
      .resolveSync();
  }

  if (verifiedEnv.config.debug) {
    logger.info(JSON.stringify(verifiedEnv, undefined, 2));
  }

  return verifiedEnv;
}
