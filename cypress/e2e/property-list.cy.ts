import path from 'path';

describe('navigate to property list', () => {
  beforeEach(() => {
    cy.task('mongodb:seed', path.join('simple.xlsx'));
    cy.login();
  });

  it('passes', () => {
    cy.navigatePropertyList();
  });
});
