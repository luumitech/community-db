import { type Context } from '~/graphql/context';
import { getCommunityEntry } from '~/graphql/schema/community/util';
import { DEFAULT_PROPERTY_ORDER_BY } from '~/graphql/schema/property/util';

/**
 * Get property list for a given community from database
 *
 * @param user Context user performing search
 * @param communityId Community shortID
 * @returns
 */
export async function communityData(
  user: Context['user'],
  communityId: string
) {
  const data = await getCommunityEntry(user, communityId, {
    include: {
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
export type Membership = Property['membershipList'][0];
export type Event = Membership['eventAttendedList'][0];
export type Ticket = Event['ticketList'][0];
