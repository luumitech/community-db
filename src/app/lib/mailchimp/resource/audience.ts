import { GraphQLError } from 'graphql';
import { Resource } from '.';

export class Audience {
  constructor(private res: Resource) {}

  /**
   * Get information about all lists in the account.
   *
   * See: https://mailchimp.com/developer/marketing/api/lists/get-lists-info/
   */
  async lists() {
    return this.res.getAll('lists', 'lists', ['id', 'name']);
  }

  /**
   * Get information about members in a specific Mailchimp list.
   *
   * See:
   * https://mailchimp.com/developer/marketing/api/list-members/list-members-info/
   */
  async memberLists(listId: string) {
    return this.res.getAll(`lists/${listId}/members`, 'members', [
      'email_address',
      'full_name',
    ]);
  }
}
