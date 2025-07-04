import * as GQL from '~/graphql/generated/graphql';

type PropertyEntry =
  GQL.ExportContactPropertyListQuery['communityFromId']['rawPropertyList'][number];

type OccupantEntry = PropertyEntry['occupantList'][number];

export interface ContactListEntry extends OccupantEntry {
  /** Unique ID for each contact entry, required for Table rendering */
  id: string;
  address: string;
}

export interface ContactInfo {
  contactList: ContactListEntry[];
  propertyCount: number;
}

/**
 * Convert propertyList into list of contacts that have not opted out of
 * subscribing to newsletter
 *
 * @param propertyList PropertyList obtained from graphqQL
 * @returns Opted in contact list
 */
export function toContactList(propertyList: PropertyEntry[]): ContactInfo {
  const contactList = propertyList
    .flatMap((property) =>
      property.occupantList.map<ContactListEntry | null>((occupant, idx) => {
        const { optOut, ...other } = occupant;
        if (!!optOut || !other.email) {
          return null;
        }
        return {
          id: `${property.id}-${idx}`,
          address: property.address,
          ...other,
        };
      })
    )
    .filter((entry): entry is ContactListEntry => entry != null);

  return {
    propertyCount: propertyList.length,
    contactList,
  };
}
