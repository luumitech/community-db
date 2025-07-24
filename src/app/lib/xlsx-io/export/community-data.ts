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

type PartialExcept<T, K extends keyof T = never> = [K] extends [never]
  ? Partial<T>
  : {
      /** Keys in K stay required */
      [P in K]-?: T[P];
    } & {
      /** All other keys become optional */
      [P in Exclude<keyof T, K>]?: T[P];
    };

/** Data type used to export data into workbooks */
export type Community = PartialExcept<
  Awaited<ReturnType<typeof communityData>>,
  'name' | 'propertyList'
>;
export type Property = PartialExcept<
  Community['propertyList'][number],
  'address' | 'occupantList' | 'membershipList'
>;
export type Occupant = PartialExcept<Property['occupantList'][number]>;
export type Membership = PartialExcept<
  Property['membershipList'][number],
  'eventAttendedList'
>;
export type Event = PartialExcept<
  Membership['eventAttendedList'][number],
  'ticketList'
>;
export type Ticket = PartialExcept<Event['ticketList'][number]>;
