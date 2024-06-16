import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import prisma from '../../../lib/prisma';
import { type Context } from '../../context';

type FindArgs = Omit<Prisma.CommunityFindFirstOrThrowArgs, 'where'>;

/**
 * Get community database entry of a given ID
 * and verify if user has access to it
 *
 * @param user context user performing search
 * @param shortId community shortID
 * @param args prisma findFirstOrThrow arguments
 * @returns
 */
export async function getCommunityEntry<T extends FindArgs>(
  user: Context['user'],
  shortId: string,
  args?: Prisma.SelectSubset<T, FindArgs>
) {
  try {
    const entry = await prisma.community.findFirstOrThrow<T>({
      ...args!,
      where: {
        shortId,
        accessList: {
          some: {
            user: { email: user.email },
          },
        },
      } satisfies Prisma.CommunityWhereInput,
    });
    return entry;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        /**
         * https://www.prisma.io/docs/orm/reference/error-reference#p2025
         */
        case 'P2025':
          throw new GraphQLError(`Community ${shortId} Not Found`);
      }
    }
    throw err;
  }
}
