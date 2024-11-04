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

  /**
   * Env vars that are exposed to UI
   *
   * NOTE: Do not expose anything sensitive information here
   */
  nextPublic: yup.object({
    /**
     * Basepath used by client to construct URL (do not add slash at end)
     * `protocol://hostname:port`
     */
    hostname: yup.string().required(),
    /**
     * App version information
     *
     * Used in About modal
     */
    appVersion: yup.string(),
    gitBranch: yup.string(),
    gitCommitHash: yup.string(),
    /** Subscription Plan details */
    plan: yup.object({
      /** Is Subscription plan enabled */
      enable: yup.string().required(),
      /** Name of paid subscription plan */
      name: yup.string().required(),
      /** Cost of paid subscription plan */
      cost: yup.number().required(),
    }),
  }),

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

  // Geoapify
  geoapify: yup.object({
    url: yup.string().required(),
    key: yup.string().required(),
  }),

  // Payment
  payment: yup.object({
    helcim: yup.object({
      planId: yup.number().required(),
      apiKey: yup.string().required(),
    }),
  }),

  email: yup.object({
    /** Website contact information */
    contactInfo: yup.string().required(),

    mailjet: yup.object({
      /** Mailjet credential */
      api: yup.object({
        key: yup.string().required(),
        secret: yup.string().required(),
      }),
      /** Call the API, but not actually sanding mail */
      sandboxMode: yup.boolean(),
      /** Mailjet verified sender email */
      sender: yup.string().required(),
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
