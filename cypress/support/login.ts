import { createAuthClient } from 'better-auth/client';

/** Create session token to simulate the action of user logging in */
Cypress.Commands.add('login', () => {
  // Set theme to light theme
  window.localStorage.setItem('theme', 'light');

  cy.wrap(null).then(async () => {
    const authClient = createAuthClient({
      baseURL: Cypress.env('BETTER_AUTH_URL'),
    });
    const { error } = await authClient.signIn.email({
      email: Cypress.env('AUTH_TEST_EMAIL'),
      password: Cypress.env('AUTH_TEST_PASSWORD'),
    });
    // Verify login to be successful
    expect(error).to.be.null;
  });
});
