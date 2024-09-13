Cypress.Commands.add('clickMainMenu', () => {
  cy.findByLabelText('Open menu').click();
});

Cypress.Commands.add('clickMenuItem', (itemLabel: string) => {
  cy.findByRole('link', { name: new RegExp(itemLabel) }).click();
});
