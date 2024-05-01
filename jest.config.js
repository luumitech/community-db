module.exports = {
  setupFiles: ['<rootDir>/.jest/set-env-vars.ts'],
  globalSetup: '<rootDir>/.jest/global-setup.ts',
  globalTeardown: '<rootDir>/.jest/global-teardown.ts',
  //   setupFilesAfterEnv: ['jest-extended/all', './src/custom-jest-extend.ts'],
  moduleNameMapper: {
    '~/([^${}]*)$': '<rootDir>/src/app/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '\\.tsx?$': 'babel-jest',
  },
  testMatch: ['<rootDir>/src/**/?(*.)(spec).(ts|js)?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],

  // Reset all mocks usage data
  clearMocks: true,
};
