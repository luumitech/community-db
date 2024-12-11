import path from 'path';

// Default timeout
const timeout = 10000;

/**
 * Take screenshot and save them into `/src/app/view/landing/getting-started`
 * directory
 */
function takeScreenshot(name: string) {
  // Wait a bit before taking screenshot, in case there is animation
  // that needs to be transitioned through
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
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
  before(() => {
    // Seed data if database doesn't exist
    // cy.task('mongodb:seed-random', 10);
  });

  beforeEach(() => {
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
      .filter<HTMLTableRowElement>((index, tr) => {
        const members = tr.cells[1];
        const curYear = tr.cells[2];
        // Grab Members with some text and Current year should have a checkmark
        return members.innerText !== '' && curYear.innerHTML.includes('<svg');
      })
      .first()
      .click();

    // Wait for property detail page
    cy.findByLabelText('Membership Info For Year', { timeout });
    takeScreenshot('property-detail');

    cy.clickButton('Edit Membership Info');
    cy.findByRole('dialog').contains('Edit Membership Info');
    takeScreenshot('membership-editor');
    cy.clickButton('Cancel');

    // cy.clickButton('Edit Member Details');
    // cy.findByRole('dialog').contains('Edit Member Details');
    // takeScreenshot('occupant-editor');
    // cy.clickButton('Cancel');

    cy.clickMainMenu();
    cy.clickMenuItem('Dashboard');
    // Wait for graphs to be loaded
    cy.get('div.grid div[data-loaded="true"]', { timeout }).should(
      'have.length',
      3
    );
    cy.scrollTo(0, 370);
    takeScreenshot('dashboard');

    cy.clickMainMenu();
    cy.clickMenuItem('Export to Excel');
    cy.findByText('Download', { timeout });
    cy.get('table').parent().scrollTo(1950, 0);
    takeScreenshot('export-to-xlsx');
  });
});
