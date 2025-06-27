import { jsonc } from 'jsonc';
import { unstable_noStore } from 'next/cache';
import { Logger } from '~/lib/logger';
import { z, zz } from '~/lib/zod';
import { isBuilding } from './env-var';

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
  NEXT_PUBLIC_HOSTNAME: zz.string.envVar(),
  /** App version information (used in about modal) */
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
  NEXT_PUBLIC_GIT_BRANCH: z.string().optional(),
  NEXT_PUBLIC_GIT_COMMIT_HASH: z.string().optional(),
  /** Subscription Plan details */
  /** Is Subscription plan enabled? */
  NEXT_PUBLIC_PLAN_ENABLE: zz.coerce.toBoolean(),
  /** Name and cost of Free plan */
  NEXT_PUBLIC_PLAN_FREE_NAME: zz.string.envVar(),
  NEXT_PUBLIC_PLAN_FREE_COST: z.coerce.number(),
  NEXT_PUBLIC_PLAN_FREE_MAX_COMMUNITY: z.coerce.number(),
  NEXT_PUBLIC_PLAN_FREE_MAX_PROPERTY: z.coerce.number(),
  /** Name and cost of Premium plan */
  NEXT_PUBLIC_PLAN_PREMIUM_NAME: zz.string.envVar(),
  NEXT_PUBLIC_PLAN_PREMIUM_COST: z.coerce.number(),
  NEXT_PUBLIC_PLAN_PREMIUM_MAX_COMMUNITY: z.coerce.number(),
  NEXT_PUBLIC_PLAN_PREMIUM_MAX_PROPERTY: z.coerce.number(),

  /** True only if Jest is running */
  JEST_RUNNING: zz.coerce.toBoolean(),

  /** Logger output filtering, see README for details */
  LOG_DEBUG: z.string().optional(),
  /** Log environment variable values for debuggin purpose */
  CONFIG_DEBUG: zz.coerce.toBoolean(),

  /** Cypher keys */
  CIPHER_KEY: zz.string.envVar(),
  CIPHER_IV: zz.string.envVar(),

  /** Google related env vars */
  /** For google login */
  GOOGLE_CLIENT_ID: zz.string.envVar(),
  GOOGLE_CLIENT_SECRET: zz.string.envVar(),

  /** Mongo configurations */
  MONGODB_URI: zz.string.envVar(),

  /** Uploadthing configuration */
  UPLOADTHING_TOKEN: zz.string.envVar(),

  /** Geoapify */
  GEOAPIFY_URL: zz.string.envVar(),
  GEOAPIFY_KEY: zz.string.envVar(),

  /** Payment Configuration */
  PAYMENT_HELCIM_PLAN_ID: z.coerce.number(),
  PAYMENT_HELCIM_API_KEY: zz.string.envVar(),

  /** Google Recaptcha configuration */
  NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: z.string(),
  GOOGLE_RECAPTCHA_SECRET_KEY: z.string(),

  /** Nodemailer configuration */
  EMAIL_SERVER_USER: zz.string.envVar(),
  EMAIL_SERVER_PASSWORD: zz.string.envVar(),
  EMAIL_SERVER_HOST: zz.string.envVar(),
  EMAIL_SERVER_PORT: z.coerce.number(),
  EMAIL_SERVER_SECURE: zz.coerce.toBoolean(),
  EMAIL_FROM: zz.string.envVar(),
});

const azureStorageSchema = z.discriminatedUnion('AZURE_STORAGE_MODE', [
  z.object({
    /** Local Azurite configuration */
    AZURE_STORAGE_MODE: z.literal('local'),
    AZURE_LOCAL_STORAGE_HOST: zz.string.envVar(),
    AZURE_LOCAL_STORAGE_PORT: z.coerce.number(),
    AZURE_LOCAL_STORAGE_ACCOUNT: zz.string.envVar(),
    AZURE_LOCAL_STORAGE_ACCOUNT_KEY: zz.string.envVar(),
  }),
  z.object({
    /** Remote Azure storage configuration */
    AZURE_STORAGE_MODE: z.literal('remote'),
    AZURE_STORAGE_ACCOUNT: zz.string.envVar(),
    AZURE_STORAGE_ACCOUNT_KEY: zz.string.envVar(),
  }),
  z.object({
    AZURE_STORAGE_MODE: z.literal('none'),
  }),
]);

const schema = baseSchema.and(azureStorageSchema);
let _env: z.infer<typeof schema> | null = null;

/**
 * Validate process.env against zod schema and returned typed version
 *
 * @returns Typed version of process.env
 */
function initializeEnv() {
  // Prevent NextJs from caching this function
  unstable_noStore();

  if (isBuilding()) {
    return schema.parse(process.env);
  }

  // During runtime, we only want to verify env var against schema once
  if (_env == null) {
    _env = schema.parse(process.env);

    if (_env.CONFIG_DEBUG) {
      logger.info(jsonc.stringify(_env, undefined, 2));
    }
  }

  return _env;
}

export const env = initializeEnv();
