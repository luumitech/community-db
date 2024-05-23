const OmniConfig = require('omniconfig.js').default;
const yup = require('yup');

/**
 * Check a list of env variables that must be present
 * for the application to work properly
 *
 * When adding new environment variables, please also update
 * the typescript declaration file: environment.d.ts
 */
const schema = yup.object({
  // See: https://next-auth.js.org/configuration/options#nextauth_secret
  NEXTAUTH_SECRET: yup.string().required(),
  // For google login
  GOOGLE_CLIENT_ID: yup.string().required(),
  GOOGLE_CLIENT_SECRET: yup.string().required(),
});

OmniConfig.withYup(schema)
  .useEnvironmentVariables({
    processEnv: true,
    dotEnv: '.env[.node_env][.local]',
  })
  .resolveSync();
