import { Community, Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { type ContextUser } from '~/lib/context-user';
import prisma from '~/lib/prisma';

type FindArgs = Omit<Prisma.CommunityFindFirstOrThrowArgs, 'where'>;

/**
 * Get community database entry of a given ID and verify if user has access to
 * it
 *
 * @param user Context user performing search
 * @param shortId Community shortID
 * @param args Prisma findFirstOrThrow arguments (sans where)
 * @returns
 */
export async function getCommunityEntry<T extends FindArgs>(
  user: ContextUser,
  shortId: string,
  args?: Prisma.SelectSubset<T, FindArgs>
) {
  try {
    const where: Prisma.CommunityWhereInput = {
      shortId,
      accessList: {
        some: {
          user: { email: user.email },
        },
      },
    };
    const entry = await prisma.community.findFirstOrThrow<T>({
      ...args!,
      where,
    });
    return entry;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        /** https://www.prisma.io/docs/orm/reference/error-reference#p2025 */
        case 'P2025':
          throw new GraphQLError(`Community ${shortId} Not Found`, {
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
 * Generate update instruction for Community document so that `minYear` and
 * `maxYear` contains the input `yearToCheck`
 *
 * @param community Original community document containing `minYear`/`maxYear`
 * @param yearsToCheck Years to check if community `minYear`/`maxYear` should be
 *   updated
 * @returns Update instruction to community document
 */
export function communityMinMaxYearUpdateArgs(
  community: Pick<Community, 'minYear' | 'maxYear'>,
  ...yearsToCheck: number[]
) {
  const updateData: Prisma.CommunityUpdateArgs['data'] = {};
  const minYear = Math.min(...yearsToCheck);
  const maxYear = Math.max(...yearsToCheck);

  if (community.minYear == null || minYear < community.minYear) {
    updateData.minYear = minYear;
  }
  if (community.maxYear == null || maxYear > community.maxYear) {
    updateData.maxYear = maxYear;
  }
  return updateData;
}
