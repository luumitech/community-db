import path from 'path';

// Default timeout
const timeout = 10000;

class ScreenShot {
  propertyList() {
    cy.navigatePropertyList();
    cy.findByLabelText('Loading').should('exist');
    cy.findByLabelText('Loading').should('not.exist');
    this.takeScreenshot('property-list');
  }

  propertyDetail() {
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
    cy.findByText('Membership Status', { timeout });
    this.takeScreenshot('property-detail');
  }

  membershipEditor() {
    cy.clickHeaderMoreMenu();
    cy.clickRoleMenuItem('Edit Membership Detail');
    cy.findByRole('dialog').contains('Membership Detail');
    this.takeScreenshot('membership-editor');
    cy.clickButton('Cancel');
  }

  occupantEditor() {
    cy.clickHeaderMoreMenu();
    cy.clickRoleMenuItem('Edit Contact Information');
    cy.findByRole('dialog').contains('Edit Contact Information');
    this.takeScreenshot('occupant-editor');
    cy.clickButton('Cancel');
  }

  dashboard() {
    cy.clickHeaderMoreMenu();
    cy.clickRoleMenuItem('Dashboard');
    // Wait for graphs to be loaded
    cy.get('div.grid div[data-loaded="true"]', { timeout }).should(
      'have.length.gte',
      3
    );
    cy.scrollTo(0, 370);
    this.takeScreenshot('dashboard');
  }

  exportXlsx() {
    cy.clickHeaderMoreMenu();
    cy.clickRoleMenuItem('Export to Excel');
    // Wait for table to be loaded
    cy.get('table[data-testid="export-xlsx"]', { timeout }).should('exist');
    cy.clickButton('Export Methods');
    cy.findByRole('option', { name: 'Single Sheet' }).click({ force: true });
    cy.get('table').parent().scrollTo(1950, 0);
    this.takeScreenshot('export-to-xlsx');
  }

  /**
   * Take screenshot and save them into `/src/app/view/landing/images` directory
   *
   * @param name Screenshot file name
   */
  private takeScreenshot(name: string) {
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
              'images',
              imageName
            );
            cy.writeFile(destFn, content, 'binary');
          }
        });
      },
    });
  }
}

const screenShot = new ScreenShot();

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
    screenShot.propertyList();

    screenShot.propertyDetail();
    // This assumes we are in propertyDetail page
    screenShot.membershipEditor();
    // This assumes we are in propertyDetail page
    screenShot.occupantEditor();

    screenShot.dashboard();
    screenShot.exportXlsx();
  });
});
