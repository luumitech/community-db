import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import prisma from '../../../lib/prisma';
import { type Context } from '../../context';

/**
 * Get community database entry of a given ID
 * and verify if user has access to it
 */
export async function getCommunityEntry(
  user: Context['user'],
  communityId: string,
  findArgs?: Omit<
    Parameters<typeof prisma.community.findUniqueOrThrow>[0],
    'where'
  >
) {
  try {
    const entry = await prisma.community.findUniqueOrThrow({
      ...findArgs,
      where: {
        id: communityId,
        accessList: {
          some: {
            user: {
              email: user.email,
            },
          },
        },
      },
    });
    return entry;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        /**
         * https://www.prisma.io/docs/orm/reference/error-reference#p2025
         */
        case 'P2025':
          throw new GraphQLError(`Community ${communityId} Not Found`);
      }
    }
    throw err;
  }
}
