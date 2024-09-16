import path from 'path';

/**
 * Take screenshot and save them into `/src/app/view/landing/getting-started`
 * directory
 */
function takeScreenshot(name: string) {
  cy.screenshot(name, {
    overwrite: true,
    capture: 'viewport',
    onAfterScreenshot: ($el, props) => {
      cy.readFile(props.path, 'binary').then((content) => {
        const imageName = props.path.split('/').pop();
        if (props.size && imageName) {
          const destFn = path.join(
            'src',
            'app',
            'view',
            'landing',
            'getting-started',
            imageName
          );
          cy.writeFile(destFn, content, 'binary');
        }
      });
    },
  });
}

describe('take screenshots for landing screen', () => {
  beforeEach(() => {
    // cy.task('mongodb:seed-random', 10);
    // Determine the dimension of the viewport and screenshot
    cy.viewport(1000, 700);
    cy.login();
  });

  it('takes screenshots', { scrollBehavior: false }, () => {
    cy.navigatePropertyList();
    cy.findByLabelText('Loading').should('exist');
    cy.findByLabelText('Loading').should('not.exist');
    takeScreenshot('property-list');

    cy.findByLabelText('Property Table')
      .find('tbody')
      .findAllByRole('row')
      // Find first property with at least one occupants
      .find('td[data-key$="occupant"]')
      .contains(/^\w+/)
      .click();
    cy.wait(2000);
    cy.get('button').contains('Edit Membership Info');
    cy.get('button').contains('Edit Member Details');
    takeScreenshot('property-detail');

    cy.clickButton('Edit Membership Info');
    cy.wait(2000);
    cy.findByRole('dialog').contains('Edit Membership Info');
    takeScreenshot('membership-editor');
    cy.clickButton('Cancel');

    // cy.clickButton('Edit Member Details');
    // cy.wait(2000);
    // cy.findByRole('dialog').contains('Edit Member Details');
    // takeScreenshot('occupant-editor');
    // cy.clickButton('Cancel');

    cy.clickMainMenu();
    cy.clickMenuItem('Dashboard');
    cy.wait(6000);
    cy.findByText('Dashboard');
    cy.scrollTo(0, 370);
    takeScreenshot('dashboard');

    cy.clickMainMenu();
    cy.clickMenuItem('Export to Excel');
    cy.wait(3000);
    cy.get('table').parent().scrollTo(1950, 0);
    takeScreenshot('export-to-xlsx');
  });
});
