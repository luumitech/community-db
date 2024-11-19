import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({});

const customJestConfig: Config = {
  setupFiles: ['<rootDir>/.jest/set-env-vars.ts'],
  globalSetup: '<rootDir>/.jest/global-setup.ts',
  globalTeardown: '<rootDir>/.jest/global-teardown.ts',
  //   setupFilesAfterEnv: ['jest-extended/all', './src/custom-jest-extend.ts'],
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
  ];

  const createConfig = createJestConfig(customJestConfig);
  const jestConfig = await createConfig();

  // Override the default '/node_modules/'
  if (jestConfig.transformIgnorePatterns?.[0] === '/node_modules/') {
    jestConfig.transformIgnorePatterns[0] += `(?!${esModules.join('|')})`;
  }

  return jestConfig;
}

export default config;
