import dotenv from 'dotenv';
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({});

// Process .env.test files
dotenv.config({ path: './.env.test' });

const customJestConfig: Config = {
  setupFiles: ['<rootDir>/.jest/set-env-vars.ts'],
  globalSetup: '<rootDir>/.jest/global-setup.ts',
  globalTeardown: '<rootDir>/.jest/global-teardown.ts',
  setupFilesAfterEnv: [
    'jest-extended/all',
    '<rootDir>/src/jest-setup/debug.ts',
  ],
  moduleNameMapper: {
    '~/([^${}]*)$': '<rootDir>/src/app/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '\\.tsx?$': ['babel-jest', { configFile: './.jest/babel.config.js' }],
  },
  testMatch: ['<rootDir>/src/**/?(*.)(spec).(ts|js)?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Reset all mocks usage data
  clearMocks: true,
};

async function config() {
  const esModules = [
    // query-string are ESModules and should not be transformed
    // See: https://github.com/sindresorhus/query-string/issues/366
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
    /**
     * Better-auth has dependency on ESModules after 1.3.9
     *
     * See: https://github.com/better-auth/better-auth/issues/4531
     */
    'better-auth',
    '@better-auth',
    '@noble',
    'jose',
  ];

  const createConfig = createJestConfig(customJestConfig);
  const jestConfig = await createConfig();

  // Replace the default '/node_modules/' with a custom one
  const transformIgnorePatterns = (
    jestConfig.transformIgnorePatterns ?? []
  ).filter((entry) => !entry.startsWith('/node_modules/'));
  transformIgnorePatterns.push(`/node_modules/(?!${esModules.join('|')})`);

  return {
    ...jestConfig,
    transformIgnorePatterns,
  };
}

export default config;
