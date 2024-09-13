import { defineConfig } from 'cypress';
import { mongodbSeed } from './cypress/plugins/mongodb-seed';

export default defineConfig({
  env: {
    NEXTAUTH_SECRET: 'cypress-test',
    NEXTAUTH_SESSION_USER: {
      name: 'J Smith',
      email: 'test@email.com',
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', { 'mongodb:seed': mongodbSeed });
    },
  },
});
