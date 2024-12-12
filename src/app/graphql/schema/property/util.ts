import { Membership, Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as R from 'remeda';
import { type Context } from '~/graphql/context';
import prisma from '~/lib/prisma';
import { getCommunityOwnerSubscriptionEntry } from '../payment/util';
import { PropertyFilterInput } from './modify';

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
  const query = {
    OR: [] as Prisma.PropertyWhereInput[],
    AND: [] as Prisma.PropertyWhereInput[],
  };
  const { searchText, memberEvent, memberYear, nonMemberYear } = args ?? {};

  const trimSearchText = searchText?.trim();
  if (trimSearchText) {
    query.OR.push(
      { address: { mode: 'insensitive', contains: trimSearchText } },
      {
        occupantList: {
          some: {
            OR: [
              { firstName: { mode: 'insensitive', contains: trimSearchText } },
              { lastName: { mode: 'insensitive', contains: trimSearchText } },
            ],
          },
        },
      }
    );
  }

  // Construct filters within `membershipList`
  if (nonMemberYear != null) {
    query.AND.push({
      OR: [
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
    query.AND.push({
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

  // Only include AND/OR if they contain instruction
  return {
    ...(query.OR.length > 0 && { OR: query.OR }),
    ...(query.AND.length > 0 && { AND: query.AND }),
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
