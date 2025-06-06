import { type ThirdPartyIntegrationMailchimpMemberListQuery } from '~/graphql/generated/graphql';

type AudienceEntry =
  ThirdPartyIntegrationMailchimpMemberListQuery['mailchimpMemberList'][number];
type Occupant = NonNullable<
  Required<AudienceEntry>['property']
>['occupantList'][number];

/**
 * Add additional properties to audience list to help user synchronize the
 * contact list in the database
 */
export interface AudienceMember extends AudienceEntry {
  occupant?: Occupant;
  /**
   * Indicates that the settings in mailchimp audience list is not the same as
   * the one in database. Contains the warning message.
   */
  warning?: string;
}
