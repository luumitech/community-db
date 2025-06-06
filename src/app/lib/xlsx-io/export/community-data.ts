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
export type Property = Community['propertyList'][number];
export type Occupant = Property['occupantList'][number];
export type Membership = Property['membershipList'][number];
export type Event = Membership['eventAttendedList'][number];
export type Ticket = Event['ticketList'][number];
