import { Prisma, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { type Context } from '~/graphql/context';
import prisma from '~/lib/prisma';

type FindArgs = Omit<Prisma.AccessFindFirstOrThrowArgs, 'where'>;
type CreateArgs = Omit<Prisma.AccessCreateArgs, 'data'>;
type DataArg = Pick<Prisma.AccessCreateArgs, 'data'>;

/**
 * Create Access document for a particular user
 * i.e. giving access to a community database for a given user
 * if the context user is not in the database, one will be
 * created
 *
 * @param user context user
 * @param communityId community ID to give access for
 * @param role permission (default to ADMIN)
 * @param args optional args to pass into access.create
 * @returns access document
 */
export function createAccess<T extends CreateArgs>(
  communityId: string,
  email: string,
  role: Role = 'ADMIN',
  args?: Prisma.SelectSubset<T, CreateArgs>
) {
  return prisma.access.create<T & DataArg>({
    ...args!,
    data: {
      role,
      user: {
        connectOrCreate: {
          where: { email },
          create: { email },
        },
      },
      community: {
        connect: { id: communityId },
      },
    },
  });
}

/**
 * Check access for the context user, and verify
 * if user has the correct access
 *
 * @param user context user
 * @param community community 'where' input
 * @param roleList list of roles to check
 * @returns access document
 */
export async function verifyAccess(
  user: Context['user'],
  community: Prisma.AccessWhereInput['community'],
  roleList: Role[]
) {
  try {
    const access = await prisma.access.findFirstOrThrow({
      where: {
        user: { email: user.email },
        community,
      },
    });
    if (!roleList.includes(access.role)) {
      throw new GraphQLError(`You are not authorized to perform this action`);
    }

    return access;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        /**
         * https://www.prisma.io/docs/orm/reference/error-reference#p2025
         */
        case 'P2025':
          throw new GraphQLError(
            `Access entry for community ${JSON.stringify(community)} Not Found`
          );
      }
    }
    throw err;
  }
}
