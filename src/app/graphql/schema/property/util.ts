import { Event, Membership, Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as R from 'remeda';
import { type ContextUser } from '~/lib/context-user';
import prisma from '~/lib/prisma';
import { getCommunityOwnerSubscriptionEntry } from '../payment/util';
import { PropertyFilterInput } from './batch-modify';
import { EventInput } from './modify';

type FindArgs = Omit<Prisma.PropertyFindFirstOrThrowArgs, 'where'>;

/** Default sort order in property list */
export const DEFAULT_PROPERTY_ORDER_BY: Prisma.PropertyOrderByWithRelationInput[] =
  [{ streetName: 'asc' }, { streetNo: 'asc' }];

/**
 * Get property database entry of a given ID and verify if user has access to it
 *
 * @param user Context user performing search
 * @param shortId Property shortID
 * @param args Prisma findFirstOrThrow arguments
 * @returns
 */
export async function getPropertyEntry<T extends FindArgs>(
  user: ContextUser,
  shortId: string,
  args?: Prisma.SelectSubset<T, FindArgs>
) {
  try {
    const where: Prisma.PropertyWhereInput = {
      shortId,
      community: {
        accessList: {
          some: {
            user: { email: user.email },
          },
        },
      },
    };
    const entry = await prisma.property.findFirstOrThrow<T>({
      ...args!,
      where,
    });
    return entry;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        /** https://www.prisma.io/docs/orm/reference/error-reference#p2025 */
        case 'P2025':
          throw new GraphQLError(`Property ${shortId} Not Found`, {
            extensions: {
              errCode: err.code,
            },
          });
      }
    }
    throw err;
  }
}

/**
 * Get property database entry within a community
 *
 * @param communityShortId Community shortID
 * @param shortId Property shortID
 * @param args Prisma findFirstOrThrow arguments
 * @returns
 */
export async function getPropertyEntryWithinCommunity<T extends FindArgs>(
  communityShortId: string,
  shortId: string,
  args?: Prisma.SelectSubset<T, FindArgs>
) {
  try {
    const where: Prisma.PropertyWhereInput = {
      shortId,
      communityId: communityShortId,
    };
    const entry = await prisma.property.findFirstOrThrow<T>({
      ...args!,
      where,
    });
    return entry;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        /** https://www.prisma.io/docs/orm/reference/error-reference#p2025 */
        case 'P2025':
          throw new GraphQLError(`Property ${shortId} Not Found`, {
            extensions: {
              errCode: err.code,
            },
          });
      }
    }
    throw err;
  }
}

/**
 * Verify if a membership entry is considered to be a valid member
 *
 * @param entry Membership entry
 * @returns
 */
export function isMember(entry?: Membership | null) {
  if (!entry) {
    return false;
  }
  return entry.eventAttendedList.length > 0;
}

/**
 * Given a list of membership entries for every year, find if client has
 * membership of a given year
 *
 * @param list List of membership entries
 * @param year Year to look into
 * @returns
 */
export function isMemberInYear(list: Membership[], year: number) {
  const membershipEntry = list.find((entry) => entry.year === year);
  return isMember(membershipEntry);
}

/**
 * Construct the base propertyList arguments given a communityId
 *
 * @param communityId Community Id associated to property
 * @returns
 */
function propertyListBaseFindManyArgs(communityId: string) {
  const query: Required<
    Pick<Prisma.PropertyFindManyArgs, 'where' | 'orderBy'>
  > = {
    where: { communityId },
    orderBy: DEFAULT_PROPERTY_ORDER_BY,
  };
  return query;
}

/**
 * Construct mongo query `WHERE` inputs to get results that matches the filter
 * arguments
 *
 * @param args Property filter arguments
 * @returns Mongo filter `where` input
 */
function propertyListFilterArgs(
  args?: typeof PropertyFilterInput.$inferInput | null
): Prisma.PropertyWhereInput {
  const AND: Prisma.PropertyWhereInput[] = [];

  const { searchText, memberEvent, memberYear, nonMemberYear, withGps } =
    args ?? {};

  const trimSearchText = searchText?.trim();
  if (trimSearchText) {
    const OR: Prisma.PropertyWhereInput[] = [
      { address: { mode: 'insensitive', contains: trimSearchText } },
    ];

    /**
     * Matching searchText again name is slightly more complicated, we want to
     * search against `${firstName} ${lastName}`, but we don't have ability to
     * concat the fields in Prisma prior to do searching
     *
     * If searhText only has one word, we'll also try to match against
     * occupant's email
     */
    const nameList = trimSearchText.split(' ');
    if (nameList) {
      // If only a single name is provided, search against either firstName or lastName
      if (nameList.length === 1) {
        OR.push({
          occupantList: {
            some: {
              OR: [
                { firstName: { mode: 'insensitive', startsWith: nameList[0] } },
                { lastName: { mode: 'insensitive', startsWith: nameList[0] } },
                { email: { mode: 'insensitive', contains: nameList[0] } },
              ],
            },
          },
        });
      } else if (nameList.length > 1) {
        // If both names are provided, search against firstName and lastName
        const searchLast = nameList.pop()!;
        OR.push({
          occupantList: {
            some: {
              AND: [
                {
                  firstName: {
                    mode: 'insensitive',
                    startsWith: nameList.join(' '),
                  },
                },
                { lastName: { mode: 'insensitive', startsWith: searchLast } },
              ],
            },
          },
        });
      }
    }

    // Construct the query for filtering searchText
    AND.push({ OR });
  }

  // Construct filters within `membershipList`
  if (nonMemberYear != null) {
    AND.push({
      OR: [
        { membershipList: { isSet: false } },
        {
          membershipList: {
            some: {
              // empty `eventAttendedList` implies user is not a member
              eventAttendedList: { isEmpty: true },
              year: nonMemberYear,
            },
          },
        },
        {
          membershipList: {
            none: {
              year: nonMemberYear,
            },
          },
        },
      ],
    });
  }

  if (memberYear != null || memberEvent != null) {
    AND.push({
      membershipList: {
        some: {
          // non-empty `eventAttendedList` implies user is a member
          eventAttendedList: { isEmpty: false },
          ...(memberYear && { year: memberYear }),
          ...(memberEvent && {
            eventAttendedList: { some: { eventName: memberEvent } },
          }),
        },
      },
    });
  }

  // Filter only ones with GPS coordinates
  if (withGps) {
    AND.push({
      AND: [
        // Shortcut for non-empty string check (checks for null/undefined as well)
        { lat: { gte: ' ' } },
        { lon: { gte: ' ' } },
      ],
    });
  }

  // Only include AND if it contains instruction
  return {
    ...(AND.length > 0 && { AND }),
  };
}

/**
 * Construct `prisma.property.findMany` query arguments using the specified
 * filter
 *
 * @param communityId Community Id
 * @param filterArgs Property filter arguments
 * @returns
 */
export async function propertyListFindManyArgs(
  communityId: string,
  filterArgs?: typeof PropertyFilterInput.$inferInput | null
): Promise<Prisma.PropertyFindManyArgs> {
  const findManyArgs = propertyListBaseFindManyArgs(communityId);

  /** Get application configuration base on community owner's subscription level */
  const subEntry = await getCommunityOwnerSubscriptionEntry(communityId);

  // Construct `where` clause using the arguments in filter
  const where = propertyListFilterArgs(filterArgs);

  // Add additional limiter if subscription level prevents
  // querying more entries
  const { propertyLimit } = subEntry;
  if (propertyLimit != null) {
    const list = await prisma.property.findMany({
      ...findManyArgs,
      take: propertyLimit,
      select: { id: true },
    });
    where.id = { in: list.map(({ id }) => id) };
  }

  return {
    ...findManyArgs,
    where: {
      ...findManyArgs.where,
      ...where,
    },
  };
}

/** Map EventInput to Event object in database */
export function mapEventEntry(input: typeof EventInput.$inferInput): Event {
  return {
    eventName: input.eventName,
    eventDate: input.eventDate ? new Date(input.eventDate) : null,
    ticketList: (input.ticketList ?? []).map((entry) => ({
      ticketName: entry.ticketName,
      count: entry.count ?? null,
      price: entry.price ?? null,
      paymentMethod: entry.paymentMethod ?? null,
    })),
  };
}

/**
 * Find location of the event object in the given membershipList.
 *
 * If not found, add a placeholder entry for it, and also return additional
 * information like:
 *
 * - Whether an event has been added.
 * - Whether the new event is a new membership
 *
 * @param membershipList List of existing membership list in database
 * @param memberYear MemberYear associated with event
 * @param input Event input
 * @returns MembershipIdx and eventIdx to locate the event object
 */
export function findOrAddEvent(
  membershipList: Membership[],
  /** Membership year where the event should be updated */
  memberYear: number,
  /** Event name */
  eventName: string
) {
  /**
   * `membershipList` should already be sorted by year in descending order Look
   * for the appropriate index to insert the new membership
   */
  const membershipIdx = R.sortedIndexWith(
    membershipList,
    ({ year }) => year > memberYear
  );
  let membership = membershipList[membershipIdx];
  // If existing membership is found, then update it in place, otherwise insert
  // the `membership` into the `membershipList`
  if (membership?.year !== memberYear) {
    const newMembership = {
      year: memberYear,
      paymentDeposited: null,
      eventAttendedList: [],
      price: null,
      paymentMethod: null,
    };
    membershipList.splice(membershipIdx, 0, newMembership);
    membership = membershipList[membershipIdx];
  }

  let eventIdx = membership.eventAttendedList.findIndex(
    (entry) => entry.eventName === eventName
  );
  const isNewEvent = eventIdx === -1;
  const isNewMember = membership.eventAttendedList.length === 0;
  if (isNewEvent) {
    eventIdx = membership.eventAttendedList.length;
    membership.eventAttendedList.push({
      eventName,
      eventDate: null,
      ticketList: [],
    });
  }

  // Extra safe check to make sure everything looks kosher
  if (membershipList[membershipIdx].year != memberYear) {
    throw new GraphQLError(
      'membership at membershipIdx has incorrect information'
    );
  }
  if (
    membershipList[membershipIdx].eventAttendedList[eventIdx].eventName !=
    eventName
  ) {
    throw new GraphQLError(
      'eventAttdendedList at eventIdx has incorrect information'
    );
  }

  return {
    membershipIdx,
    eventIdx,
    isNewMember,
    isNewEvent,
  };
}
