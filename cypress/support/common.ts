Cypress.Commands.add('clickMainMenu', () => {
  cy.findByLabelText('Open menu').click();
});

Cypress.Commands.add('clickHeaderMoreMenu', () => {
  cy.findByLabelText('Open Header More Menu').click();
});

Cypress.Commands.add('clickRoleLink', (itemLabel: string) => {
  cy.findByRole('link', { name: new RegExp(itemLabel) }).click();
});

Cypress.Commands.add('clickRoleMenuItem', (itemLabel: string) => {
  cy.findByRole('menuitem', { name: new RegExp(itemLabel) }).click();
});

Cypress.Commands.add('clickButton', (buttonText: string) => {
  cy.get('button[type="button"]')
    .contains(new RegExp(buttonText))
    // Allow clicking outside of viewport
    .click({ force: true });
});
