/**
 * Is the app running in production mode?
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Is running unit tests
 */
export function isRunningUnitTest() {
  return process.env.JEST_RUNNING === 'true';
}

/**
 * Check if running in server environment (i.e. Node server)
 */
export function isServer() {
  return typeof window === 'undefined';
}

/**
 * Check a list of env variables that must be present
 * for the application to work properly
 */
export function verifyEnvVar() {
  const requireEnvVariable = (key: string) => {
    const value = process.env[key];

    if (value) {
      return value;
    }

    throw new Error(`Environment variable ${key} was not defined!`);
  };

  // See: https://next-auth.js.org/configuration/options#nextauth_secret
  requireEnvVariable('NEXTAUTH_SECRET');
  // For google login
  requireEnvVariable('GOOGLE_CLIENT_ID');
  requireEnvVariable('GOOGLE_CLIENT_SECRET');
}
