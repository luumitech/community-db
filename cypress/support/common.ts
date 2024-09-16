Cypress.Commands.add('clickMainMenu', () => {
  cy.findByLabelText('Open menu').click();
});

Cypress.Commands.add('clickMenuItem', (itemLabel: string) => {
  cy.findByRole('link', { name: new RegExp(itemLabel) }).click();
});

Cypress.Commands.add('clickButton', (buttonText: string) => {
  cy.get('button[type="button"]').contains(new RegExp(buttonText)).click();
});
