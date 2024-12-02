import { Membership, Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { type Context } from '~/graphql/context';
import prisma from '~/lib/prisma';
import { PropertyFilterInput } from './modify';

type FindArgs = Omit<Prisma.PropertyFindFirstOrThrowArgs, 'where'>;

/** Default sort order in property list */
export const DEFAULT_PROPERTY_ORDER_BY: Prisma.PropertyOrderByWithRelationInput[] =
  [
    { streetName: 'asc' },
    /**
     * TODO: since streetNo is a string type, so the string sorting is not ideal
     *
     * - `1, 10, 11, ..., 2, 20, 21, ...`
     *
     * But we want
     *
     * - `i.e. 1, 2, 3, ..., 10, 11, ...`
     */
    { streetNo: 'asc' },
  ];

/**
 * Get property database entry of a given ID and verify if user has access to it
 *
 * @param user Context user performing search
 * @param shortId Property shortID
 * @param args Prisma findFirstOrThrow arguments
 * @returns
 */
export async function getPropertyEntry<T extends FindArgs>(
  user: Context['user'],
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
export function propertyListFindManyArgs(communityId: string) {
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
 * @param communityId Community ID
 * @param args Property filter arguments
 * @returns Mongo filter query
 */
export function propertyListFilterArgs(
  communityId: string,
  args?: typeof PropertyFilterInput.$inferInput | null
) {
  const query = propertyListFindManyArgs(communityId).where;
  const { searchText, memberEvent, memberYear } = args ?? {};

  if (searchText) {
    if (!query.OR) {
      query.OR = [];
    }
    query.OR.push(
      { address: { mode: 'insensitive', contains: searchText } },
      {
        occupantList: {
          some: {
            OR: [
              { firstName: { mode: 'insensitive', contains: searchText } },
              { lastName: { mode: 'insensitive', contains: searchText } },
            ],
          },
        },
      }
    );
  }

  // Construct filters within `membershipList`
  if (memberYear != null || memberEvent != null) {
    query.membershipList = {
      some: {
        // non-empty `eventAttendedList` implies user is a member
        eventAttendedList: { isEmpty: false },
        ...(memberYear && { year: memberYear }),
        ...(memberEvent && {
          eventAttendedList: { some: { eventName: memberEvent } },
        }),
      },
    };
  }

  return query;
}
