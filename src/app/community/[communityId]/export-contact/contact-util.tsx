import * as GQL from '~/graphql/generated/graphql';
import type { ContactInfo, ContactListEntry, PropertyEntry } from './_type';

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
