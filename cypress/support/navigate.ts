Cypress.Commands.add('navigatePropertyList', () => {
  cy.visit('/community');

  // Wait for menu to load
  cy.findByText('Welcome!', { timeout: 5000 });
  cy.findByRole('option', { name: 'Select Community' }).click();
  cy.findByRole('option', { name: 'My Community' }).click();

  // Wait for property list to load
  cy.findByPlaceholderText('Search Address or Member Name', { timeout: 10000 });
});
