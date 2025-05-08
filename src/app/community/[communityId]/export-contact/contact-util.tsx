import * as GQL from '~/graphql/generated/graphql';

type PropertyEntry =
  GQL.GenerateEmailListPropertyListQuery['communityFromId']['rawPropertyList'][0];

type OccupantEntry = PropertyEntry['occupantList'][0];

interface ContactListEntry extends OccupantEntry {
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
      property.occupantList.map(({ optOut, ...other }) => {
        if (!!optOut || !other.email) {
          return null;
        }
        return {
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
