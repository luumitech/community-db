Cypress.Commands.add('navigatePropertyList', () => {
  /**
   * The initial visit to root may take a little longer if the server is a dev
   * next server
   */
  cy.visit('/community', { timeout: 5000 });
  cy.clickMainMenu();
  cy.clickMenuItem('Select Community');
  cy.findByRole('option', { name: 'Test Community' }).click();
});
