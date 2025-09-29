import * as GQL from '~/graphql/generated/graphql';

type PropertyEntry =
  GQL.ExportContactPropertyListQuery['communityFromId']['rawPropertyList'][number];

type OccupantEntry = PropertyEntry['occupantList'][number];

export interface ContactListEntry
  extends Omit<OccupantEntry, 'infoList' | 'optOut'> {
  /** Unique ID for each contact entry, required for Table rendering */
  id: string;
  address: string;
  // Email is extracted from infoList
  email: string;
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
      property.occupantList.flatMap((occupant, idx) => {
        const { optOut, infoList, ...other } = occupant;
        if (optOut) {
          return [];
        }
        return infoList
          ?.filter(({ type }) => type === GQL.ContactInfoType.Email)
          .map((info, infoIdx) => ({
            id: `${property.id}-${idx}-${infoIdx}`,
            address: property.address,
            ...other,
            email: info.value,
          }));
      })
    )
    .filter((entry): entry is ContactListEntry => entry != null);

  return {
    propertyCount: propertyList.length,
    contactList,
  };
}
