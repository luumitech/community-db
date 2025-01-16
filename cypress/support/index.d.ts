declare namespace Cypress {
  interface Chainable {
    /** Create session token to simulate the action of user logging in */
    login(): Chainable<void>;

    /**
     * Click Main Hamburger menu
     *
     * @example Cy.clickMainMenu()
     */
    clickMainMenu(): void;

    /**
     * Click Header more (...) menu
     *
     * @example Cy.clickHeaderMoreMenu()
     */
    clickHeaderMoreMenu(): void;

    /**
     * Click an item with role="link"
     *
     * - Can be used for selecting menu item within main hamburger menu
     *
     * @param itemLabel A regular expression for item label
     */
    clickRoleLink(itemLabel: string): void;

    /**
     * Click an item with role="menuitem"
     *
     * - Can be used for selecting menu item within header more menu
     *
     * @param itemLabel A regular expression for item label
     */
    clickRoleMenuItem(itemLabel: string): void;

    /**
     * Click a button
     *
     * @param buttonText A regular expression for button label
     */
    clickButton(buttonText: string): void;

    /** Navigate to property list */
    navigatePropertyList(): Chainable<void>;
    // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
  }
}
