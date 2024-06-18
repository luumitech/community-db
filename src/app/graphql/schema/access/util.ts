import { Prisma, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { type Context } from '~/graphql/context';
import prisma from '~/lib/prisma';

/**
 * Create Access document for a particular user
 * i.e. giving access to a community database for a given user
 * if the context user is not in the database, one will be
 * created
 *
 * @param user context user
 * @param communityId community ID to give access for
 * @param role permission (default to ADMIN)
 * @returns access document
 */
export function createAccess(
  user: Context['user'],
  communityId: string,
  role: Role = 'ADMIN'
) {
  return prisma.access.create({
    data: {
      role,
      user: {
        connectOrCreate: {
          where: { email: user.email },
          create: { email: user.email },
        },
      },
      community: {
        connect: { id: communityId },
      },
    },
  });
}
