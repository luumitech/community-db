import { Membership, Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { type Context } from '~/graphql/context';
import prisma from '~/lib/prisma';

type FindArgs = Omit<Prisma.PropertyFindFirstOrThrowArgs, 'where'>;

/** Default sort order in property list */
export const DEFAULT_PROPERTY_ORDER_BY: Prisma.PropertyFindManyArgs['orderBy'] =
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

interface PropertySearchQueryArg {
  searchText?: string | null;
  memberYear?: number | null;
  memberEvent?: string | null;
}

/**
 * Construct mongo query filter to get results that matches the filter arguments
 *
 * @param args
 * @returns Mongo filter query
 */
export function propertySearchQuery(args: PropertySearchQueryArg) {
  // If search term is provided, construct $match query
  // for returning matched entries
  const searchQuery = [];
  if (args.searchText) {
    // See this to see why we add the surrounding quotes
    // See: https://www.mongodb.com/docs/manual/reference/operator/query/text/
    // searchQuery.push({
    //   $text: { $search: `\"${args.searchText}\"` },
    // });
    const operand = {
      // Match only from start of word boundary
      $regex: `\\b${args.searchText}`,
      $options: 'i',
    };
    searchQuery.push({
      $or: [
        { address: operand },
        { 'occupantList.firstName': operand },
        { 'occupantList.lastName': operand },
      ],
    });
  }

  if (args.memberYear != null || args.memberEvent != null) {
    const { memberYear, memberEvent } = args;
    searchQuery.push({
      membershipList: {
        $elemMatch: {
          isMember: true,
          ...(memberYear && { year: memberYear }),
          ...(memberEvent && {
            'eventAttendedList.eventName': memberEvent,
          }),
        },
      },
    });
  }

  return {
    ...(searchQuery.length > 0 && { $and: searchQuery }),
  };
}
