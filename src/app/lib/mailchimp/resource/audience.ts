import { GraphQLError } from 'graphql';
import { Resource } from '.';
import { type MailchimpSubscriberStatus } from './_type';

interface AudienceEntry {
  id: string;
  web_id: number;
  name: string;
  contact: unknown;
  permission_reminder: string;
  use_archive_bar: boolean;
  campaign_defaults: unknown;
  notify_on_subscribe: string;
  notify_on_unsubscribe: string;
  date_created: string;
  list_rating: number;
  email_type_option: boolean;
  subscribe_url_short: string;
  subscribe_url_long: string;
  beamer_address: string;
  visibility: string;
  double_optin: boolean;
  has_welcome: boolean;
  marketing_permissions: boolean;
}

interface MemberEntry {
  id: string;
  email_address: string;
  unique_email_id: string;
  contact_id: string;
  full_name: string;
  web_id: number;
  status: MailchimpSubscriberStatus;
}

export class Audience {
  constructor(private res: Resource) {}

  /**
   * Get information about all lists in the account.
   *
   * See: https://mailchimp.com/developer/marketing/api/lists/get-lists-info/
   *
   * @param keys List of properties from 'lists' array to retrieve
   * @returns
   */
  async lists(keys: (keyof AudienceEntry)[]) {
    return this.res.getAll<AudienceEntry, (typeof keys)[number]>(
      'lists',
      'lists',
      keys
    );
  }

  /**
   * Get information about members in a specific Mailchimp list.
   *
   * See:
   * https://mailchimp.com/developer/marketing/api/list-members/list-members-info/
   *
   * @param keys List of properties from 'members' array to retrieve
   * @returns
   */
  async memberLists(listId: string, keys: (keyof MemberEntry)[]) {
    return this.res.getAll<MemberEntry, (typeof keys)[number]>(
      `lists/${listId}/members`,
      'members',
      keys
    );
  }
}
