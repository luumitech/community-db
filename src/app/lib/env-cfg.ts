import { jsonc } from 'jsonc';
import { unstable_noStore } from 'next/cache';
import { Logger } from '~/lib/logger';
import { z, zNonEmptyStr, zStrToBoolean } from '~/lib/zod';

const logger = Logger('env-cfg');

/**
 * Check a list of env variables that must be present for the application to
 * work properly
 *
 * These are mapped from environment variables in `process.env` And snake case
 * names can be automatically mapped to object form.
 */
const baseSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  /**
   * Env vars that are exposed to UI
   *
   * NOTE: Do not expose anything sensitive information here
   */
  /**
   * Basepath used by client to construct URL (do not add slash at end)
   *
   * @example `protocol://hostname:port`
   */
  NEXT_PUBLIC_HOSTNAME: zNonEmptyStr(),
  /** App version information (used in about modal) */
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
  NEXT_PUBLIC_GIT_BRANCH: z.string().optional(),
  NEXT_PUBLIC_GIT_COMMIT_HASH: z.string().optional(),
  /** Subscription Plan details */
  /** Is Subscription plan enabled? */
  NEXT_PUBLIC_PLAN_ENABLE: zStrToBoolean(),
  /** Name of paid subscription plan */
  NEXT_PUBLIC_PLAN_NAME: zNonEmptyStr(),
  /** Cost of paid subscription plan */
  NEXT_PUBLIC_PLAN_COST: z.coerce.number(),

  /** See: https://next-auth.js.org/configuration/options#nextauth_url */
  NEXTAUTH_URL: zNonEmptyStr(),
  /** See: https://next-auth.js.org/configuration/options#nextauth_secret */
  NEXTAUTH_SECRET: zNonEmptyStr(),

  /** True only if Jest is running */
  JEST_RUNNING: zStrToBoolean(),

  /** Logger output filtering, see README for details */
  LOG_DEBUG: z.string().optional(),
  /** Log environment variable values for debuggin purpose */
  CONFIG_DEBUG: zStrToBoolean(),

  /** Google related env vars */
  /**
   * For google login
   *
   * Options passed into GoogleProvider from 'next-auth/providers/google';
   */
  GOOGLE_CLIENT_ID: zNonEmptyStr(),
  GOOGLE_CLIENT_SECRET: zNonEmptyStr(),

  /** Mongo configurations */
  MONGODB_URI: zNonEmptyStr(),

  /** Geoapify */
  GEOAPIFY_URL: zNonEmptyStr(),
  GEOAPIFY_KEY: zNonEmptyStr(),

  /** Payment Configuration */
  PAYMENT_HELCIM_PLAN_ID: z.coerce.number(),
  PAYMENT_HELCIM_API_KEY: zNonEmptyStr(),

  /** Email configuration */
  /** Website contact information */
  EMAIL_CONTACT_INFO: z.string(),
  /** Mailjet credential apiKey */
  EMAIL_MAILJET_API_KEY: z.string(),
  /** Mailjet credential apiSecret */
  EMAIL_MAILJET_API_SECRET: z.string(),
  /** Call the API, but not actually sanding mail */
  EMAIL_MAILJET_SANDBOX_MODE: zStrToBoolean(),
  /** Mailjet verified sender email */
  EMAIL_MAILJET_SENDER: z.string(),
});

const azureStorageSchema = z.discriminatedUnion('AZURE_STORAGE_MODE', [
  z.object({
    /** Local Azurite configuration */
    AZURE_STORAGE_MODE: z.literal('local'),
    AZURE_LOCAL_STORAGE_HOST: zNonEmptyStr(),
    AZURE_LOCAL_STORAGE_PORT: z.coerce.number(),
    AZURE_LOCAL_STORAGE_ACCOUNT: zNonEmptyStr(),
    AZURE_LOCAL_STORAGE_ACCOUNT_KEY: zNonEmptyStr(),
  }),
  z.object({
    /** Remote Azure storage configuration */
    AZURE_STORAGE_MODE: z.literal('remote'),
    AZURE_STORAGE_ACCOUNT: zNonEmptyStr(),
    AZURE_STORAGE_ACCOUNT_KEY: zNonEmptyStr(),
  }),
  z.object({
    AZURE_STORAGE_MODE: z.literal('none'),
  }),
]);

const schema = baseSchema.and(azureStorageSchema);

/**
 * Validate process.env against zod schema and returned typed version
 *
 * @returns Typed version of process.env
 */
export function initializeEnv() {
  // Prevent NextJs from caching this function
  unstable_noStore();

  const verifiedEnv = schema.parse(process.env);

  if (verifiedEnv.CONFIG_DEBUG) {
    logger.info(jsonc.stringify(verifiedEnv, undefined, 2));
  }

  return verifiedEnv;
}

export const env = initializeEnv();
