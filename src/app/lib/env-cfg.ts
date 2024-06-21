import OmniConfig from 'omniconfig.js';
import * as yup from 'yup';

/**
 * Check a list of env variables that must be present
 * for the application to work properly
 *
 * These are mapped from enviroment variables in `process.env`
 * And snake case names can be automatically mapped to object
 * form.
 */
const schema = yup.object({
  NODE_ENV: yup.string().oneOf(['development', 'production']).required(),

  // See: https://next-auth.js.org/configuration/options#nextauth_secret
  NEXTAUTH_SECRET: yup.string().required(),

  // Jest would set this to 'true' if jest is running
  JEST_RUNNING: yup.string(),

  // Log configuration
  log: yup.object({
    debug: yup.string(),
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
    /**
     * Local azurite configuration
     */
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

    /**
     * Remote azure blob storage configuration
     */
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

export const env = OmniConfig.withYup(schema)
  .useEnvironmentVariables({ processEnv: true })
  .resolveSync();
