import { defineConfig } from 'cypress';
import {
  mongodbSeedFromFixture,
  mongodbSeedRandom,
} from './cypress/plugins/mongodb-seed';

export default defineConfig({
  env: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    AUTH_TEST_EMAIL: process.env.AUTH_TEST_EMAIL,
    AUTH_TEST_PASSWORD: process.env.AUTH_TEST_PASSWORD,
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    excludeSpecPattern: [],
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', { 'mongodb:seed': mongodbSeedFromFixture });
      on('task', { 'mongodb:seed-random': mongodbSeedRandom });

      if (config.isTextTerminal) {
        // Screenshot taking should only be run manually, so exclude
        // the test from normal cypress runs
        if (Array.isArray(config.excludeSpecPattern)) {
          config.excludeSpecPattern.push(
            'cypress/e2e/landing-screenshot.cy.ts'
          );
        }
      }
      return config;
    },
  },
});
