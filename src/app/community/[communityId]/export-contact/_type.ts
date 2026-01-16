import * as GQL from '~/graphql/generated/graphql';

export type CommunityEntry =
  GQL.ExportContactPropertyListQuery['communityFromId'];
export type PropertyEntry = CommunityEntry['rawPropertyList'][number];
export type OccupantEntry = PropertyEntry['occupantList'][number];

export interface ContactListEntry extends Omit<
  OccupantEntry,
  'infoList' | 'optOut'
> {
  /** Unique ID for each contact entry, required for GridTable rendering */
  id: string;
  address: string;
  // Email is extracted from infoList
  email: string;
}

export interface ContactInfo {
  contactList: ContactListEntry[];
  propertyCount: number;
}
