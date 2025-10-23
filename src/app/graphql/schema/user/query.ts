import { GraphQLError } from 'graphql';
import * as deleteUserUtil from '~/api/auth/[...better]/delete-user-util';
import { builder } from '~/graphql/builder';
import { isProduction } from '~/lib/env-var';
import prisma from '~/lib/prisma';
import { createAccess } from '../access/util';

builder.queryField('userCurrent', (t) =>
  t.prismaField({
    type: 'User',
    resolve: async (query, parent, args, ctx, info) => {
      const { user } = ctx;

      // Find the user matching the current logged in user
      let userEntry = await prisma.user.upsert({
        ...query,
        where: { email: user.email },
        update: {},
        // create the user if not already in database
        create: { email: user.email },
      });

      // In development mode, if context user does not have access
      // to any community, then add all document accessible under
      // AUTH_TEST_EMAIL to the current context user
      // This will ensure that context user see everything that `yarn seed-db` has
      // created
      if (!isProduction()) {
        const ownAccess = await prisma.access.findFirst({
          select: { id: true },
          where: { user: { email: user.email } },
        });
        if (ownAccess == null) {
          const devAccessList = await prisma.access.findMany({
            where: { user: { email: process.env.AUTH_TEST_EMAIL } },
          });
          // clone devAccessList to context user
          // We can't create access directly in user.update because
          // mongoDB does not support composite IDs and compound
          // unique constraints
          // See: https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-composite-ids-and-constraints
          await Promise.all(
            devAccessList.map(async (devAccess) =>
              createAccess(devAccess.communityId, user.email)
            )
          );
          // Get the new userEntry again (should contain new
          // connections to the access document now)
          userEntry = await prisma.user.findUniqueOrThrow({
            ...query,
            where: { id: userEntry.id },
          });
        }
      }

      return userEntry;
    },
  })
);

builder.queryField('userDeletePrerequisiteList', (t) =>
  t.prismaField({
    type: ['Community'],
    description:
      'Provides a list of communities where the user must transfer administrative ownership before their account can be deleted.',
    resolve: async (query, parent, args, ctx, info) => {
      const { user } = ctx;

      const userEntry = await prisma.user.findUniqueOrThrow({
        where: { email: user.email },
      });
      const communityList =
        await deleteUserUtil.communityNonOwnerSoleAdministrator(userEntry.id);
      return communityList;
    },
  })
);
