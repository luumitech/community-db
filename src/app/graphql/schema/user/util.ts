import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { type ContextUser } from '~/lib/context-user';
import prisma from '~/lib/prisma';

type FindArgs = Omit<Prisma.UserFindFirstOrThrowArgs, 'where'>;

/**
 * Get user entry of current context
 *
 * @param user Context user performing search
 * @param args Prisma findFirstOrThrow arguments (sans where)
 * @returns
 */
export async function getUserEntry<T extends FindArgs>(
  user: ContextUser,
  args?: Prisma.SelectSubset<T, FindArgs>
) {
  try {
    const entry = await prisma.user.findFirstOrThrow<T>({
      ...args!,
      where: { email: user.email },
    });
    return entry;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        /** https://www.prisma.io/docs/orm/reference/error-reference#p2025 */
        case 'P2025':
          throw new GraphQLError(`User ${user.email} Not Found`, {
            extensions: {
              errCode: err.code,
            },
          });
      }
    }
    throw err;
  }
}
