import { getCommunityEntry } from '~/graphql/schema/community/util';
import { DEFAULT_PROPERTY_ORDER_BY } from '~/graphql/schema/property/util';
import { type ContextUser } from '~/lib/context-user';

/**
 * Get property list for a given community from database
 *
 * @param user Context user performing search
 * @param communityId Community shortID
 * @returns
 */
export async function communityData(user: ContextUser, communityId: string) {
  const data = await getCommunityEntry(user, communityId, {
    include: {
      updatedBy: true,
      propertyList: {
        include: {
          updatedBy: true,
        },
        orderBy: DEFAULT_PROPERTY_ORDER_BY,
      },
    },
  });
  return data;
}

/** Data type returned from communityData */
export type Community = Awaited<ReturnType<typeof communityData>>;
export type Property = Community['propertyList'][0];
export type Occupant = Property['occupantList'][0];
export type Membership = Property['membershipList'][0];
export type Event = Membership['eventAttendedList'][0];
export type Ticket = Event['ticketList'][0];
