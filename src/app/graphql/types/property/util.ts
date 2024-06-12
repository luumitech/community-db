import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import prisma from '../../../lib/prisma';
import { type Context } from '../../context';

/**
 * Get property database entry of a given ID
 * and verify if user has access to it
 */
export async function getPropertyEntry(
  user: Context['user'],
  propertyId: string,
  findArgs?: Omit<
    Parameters<typeof prisma.property.findUniqueOrThrow>[0],
    'where'
  >
) {
  try {
    const entry = await prisma.property.findUniqueOrThrow({
      ...findArgs,
      where: {
        id: propertyId,
        community: {
          accessList: {
            some: {
              user: { uid: user.uid },
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
          throw new GraphQLError(`Property ${propertyId} Not Found`);
      }
    }
    throw err;
  }
}
