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
const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'production']),

    /**
     * Env vars that are exposed to UI
     *
     * NOTE: Do not expose anything sensitive information here
     */
    /**
     * Basepath used by client to construct URL (do not add slash at end)
     * `protocol://hostname:port`
     */
    NEXT_PUBLIC_HOSTNAME: zNonEmptyStr(),
    /**
     * App version information
     *
     * Used in About modal
     */
    NEXT_PUBLIC_APP_VERSION: z.string().optional(),
    NEXT_PUBLIC_GIT_BRANCH: z.string().optional(),
    NEXT_PUBLIC_GIT_COMMIT_HASH: z.string().optional(),
    /** Subscription Plan details */
    NEXT_PUBLIC_PLAN_ENABLE: zStrToBoolean().describe(
      'Is Subscription plan enabled'
    ),
    NEXT_PUBLIC_PLAN_NAME: zNonEmptyStr().describe(
      'Name of paid subscription plan'
    ),
    NEXT_PUBLIC_PLAN_COST: z.coerce
      .number()
      .describe('Cost of paid subscription plan'),

    // See: https://next-auth.js.org/configuration/options#nextauth_url
    NEXTAUTH_URL: zNonEmptyStr(),
    // See: https://next-auth.js.org/configuration/options#nextauth_secret
    NEXTAUTH_SECRET: zNonEmptyStr(),

    JEST_RUNNING: zStrToBoolean().describe('true only if Jest is running'),

    LOG_DEBUG: z
      .string()
      .optional()
      .describe('logger output filtering, see README for details'),
    CONFIG_DEBUG: zStrToBoolean().describe(
      'Log environment variable values for debuggin purpose.'
    ),

    /** Google related env vars */
    /**
     * For google login
     *
     * Options passed into GoogleProvider from 'next-auth/providers/google';
     */
    GOOGLE_CLIENT_ID: zNonEmptyStr().describe('google auth clientID'),
    GOOGLE_CLIENT_SECRET: zNonEmptyStr().describe('google auth secret'),

    /** Mongo configurations */
    MONGODB_URI: zNonEmptyStr().describe('Mongo Database URL'),

    /** Azure configuration */
    AZURE_STORAGE_MODE: z.enum(['local', 'remote', 'none']),
    /** Local azurite configuration */
    AZURE_LOCAL_STORAGE_HOST: z.string().optional(),
    AZURE_LOCAL_STORAGE_PORT: z.coerce.number().optional(),
    AZURE_LOCAL_STORAGE_ACCOUNT: z.string().optional(),
    AZURE_LOCAL_STORAGE_ACCOUNT_KEY: z.string().optional(),
    /** Remote azure storage configuration */
    AZURE_STORAGE_ACCOUNT: z.string().optional(),
    AZURE_STORAGE_ACCOUNT_KEY: z.string().optional(),

    /** Geoapify */
    GEOAPIFY_URL: zNonEmptyStr(),
    GEOAPIFY_KEY: zNonEmptyStr(),

    /** Payment Configuration */
    PAYMENT_HELCIM_PLAN_ID: z.coerce.number(),
    PAYMENT_HELCIM_API_KEY: zNonEmptyStr(),

    /** Email configuration */
    EMAIL_CONTACT_INFO: z.string().describe('Website contact information'),
    EMAIL_MAILJET_API_KEY: z.string().describe('Mailjet credential apiKey'),
    EMAIL_MAILJET_API_SECRET: z
      .string()
      .describe('Mailjet credential apiSecret'),
    EMAIL_MAILJET_SANDBOX_MODE: zStrToBoolean().describe(
      'Call the API, but not actually sanding mail'
    ),
    EMAIL_MAILJET_SENDER: z.string().describe('Mailjet verified sender email'),
  })
  .refine(
    (cfg) => {
      if (cfg.AZURE_STORAGE_MODE !== 'local') {
        return true;
      }
      const localStorageSchema = z.object({
        AZURE_LOCAL_STORAGE_HOST: zNonEmptyStr(),
        AZURE_LOCAL_STORAGE_PORT: z.coerce.number(),
        AZURE_LOCAL_STORAGE_ACCOUNT: zNonEmptyStr(),
        AZURE_LOCAL_STORAGE_ACCOUNT_KEY: zNonEmptyStr(),
      });
      const validation = localStorageSchema.safeParse(cfg);
      return validation.success;
    },
    {
      message:
        'When AZURE_STORAGE_MODE=local, AZURE_LOCAL_STORAGE_* configuration is required',
    }
  )
  .refine(
    (cfg) => {
      if (cfg.AZURE_STORAGE_MODE !== 'remote') {
        return true;
      }
      const storageSchema = z.object({
        AZURE_STORAGE_ACCOUNT: zNonEmptyStr(),
        AZURE_STORAGE_ACCOUNT_KEY: zNonEmptyStr(),
      });
      const validation = storageSchema.safeParse(cfg);
      return validation.success;
    },
    {
      message:
        'When AZURE_STORAGE_MODE=renote, AZURE_STORAGE_* configuration is required',
    }
  );

/** Copy of env that has gone through schema validation */
let verifiedEnv: z.infer<typeof schema>;

/**
 * Return environment variables
 *
 * - Check with schema to ensure all env var values adhere to schema
 */
export function env() {
  // Prevent NextJs from caching this function
  unstable_noStore();

  if (verifiedEnv == null) {
    verifiedEnv = schema.parse(process.env);
  }

  if (verifiedEnv.CONFIG_DEBUG) {
    logger.info(JSON.stringify(verifiedEnv, undefined, 2));
  }

  return verifiedEnv;
}
