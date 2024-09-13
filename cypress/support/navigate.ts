Cypress.Commands.add('navigatePropertyList', () => {
  cy.visit('/community');
  cy.clickMainMenu();
  cy.clickMenuItem('Select Community');
  cy.findByRole('option', { name: 'Test Community' }).click();
});
