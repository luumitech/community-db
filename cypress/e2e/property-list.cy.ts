describe('navigate to property list', () => {
  beforeEach(() => {
    cy.task('mongodb:seed', 'simple.xlsx');
    cy.login();
  });

  it('passes', () => {
    cy.navigatePropertyList();
  });
});
