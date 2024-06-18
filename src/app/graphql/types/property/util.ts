import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { type Context } from '~/graphql/context';
import prisma from '~/lib/prisma';

type FindArgs = Omit<Prisma.PropertyFindFirstOrThrowArgs, 'where'>;

/**
 * Get property database entry of a given ID
 * and verify if user has access to it
 *
 * @param user context user performing search
 * @param shortId property shortID
 * @param args prisma findFirstOrThrow arguments
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
        /**
         * https://www.prisma.io/docs/orm/reference/error-reference#p2025
         */
        case 'P2025':
          throw new GraphQLError(`Property ${shortId} Not Found`);
      }
    }
    throw err;
  }
}
