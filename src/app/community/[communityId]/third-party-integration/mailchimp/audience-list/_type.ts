import {
  type ThirdPartyIntegrationEmailPropertyListQuery,
  type ThirdPartyIntegrationMailchimpMemberListQuery,
} from '~/graphql/generated/graphql';

type AudienceEntry =
  ThirdPartyIntegrationMailchimpMemberListQuery['mailchimpMemberList'][number];
export type Property =
  ThirdPartyIntegrationEmailPropertyListQuery['communityFromId']['rawPropertyList'][number];
export type Occupant = Property['occupantList'][number];

/**
 * Add additional properties to audience list to help user synchronize the
 * contact list in the database
 */
export interface AudienceMember extends AudienceEntry {
  /** Unique ID for each entry, required for GridTable rendering */
  id: string;
  property?: Property;
  occupant?: Occupant;
  /**
   * Indicates that the settings in mailchimp audience list is not the same as
   * the one in database. Contains the warning message.
   */
  warning?: string;
}

/** Arguments for useAudienceList and useRawAudienceList */
export interface AudienceListArg {
  communityId: string;
  /** Mailchimp audience list ID */
  listId?: string;
}
