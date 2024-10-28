Cypress.Commands.add('navigatePropertyList', () => {
  cy.visit('/community');

  // Wait for menu to load
  cy.findByText('Welcome!', { timeout: 5000 });
  cy.clickMainMenu();
  cy.clickMenuItem('Select Community');
  cy.findByRole('option', { name: 'Test Community' }).click();

  // Wait for property list to load
  cy.findByPlaceholderText('Search Address or Member Name', { timeout: 10000 });
});
