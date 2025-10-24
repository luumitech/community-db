import { Prisma } from '@prisma/client';

export interface PropertyFilter {
  /** Match against property address/first name/last name */
  searchText?: string | null;
  /** Only property who is a member of the given year */
  memberYear?: number | null;
  /** Only property who is NOT a member of the given year */
  nonMemberYear?: number | null;
  /** Only property who attended this event */
  memberEvent?: string | null;
  /** If true, properties with GPS. If false, properties without GPS */
  withGps?: boolean | null;
}

/**
 * Construct prisma `findMany` argument to get results that matches the filter
 * input
 *
 * @param filter Property filter input
 * @returns Prisma findMany argument input
 */
export function propertyListPrismaQuery(
  filter?: PropertyFilter | null
): Prisma.PropertyFindManyArgs {
  const AND: Prisma.PropertyWhereInput[] = [];

  const { searchText, memberEvent, memberYear, nonMemberYear, withGps } =
    filter ?? {};

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

  // Filter only ones with/without GPS coordinates
  if (withGps != null) {
    if (withGps) {
      AND.push({
        lat: { gte: ' ' },
        lon: { gte: ' ' },
      });
    } else {
      AND.push({
        AND: [
          { OR: [{ lat: { isSet: false } }, { lat: null }] },
          { OR: [{ lon: { isSet: false } }, { lon: null }] },
        ],
      });
    }
  }

  // Only include AND if it contains instruction
  if (AND.length > 0) {
    return { where: { AND } };
  }
  return {};
}
