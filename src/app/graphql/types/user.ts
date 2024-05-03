import { GraphQLError } from 'graphql';
import { isProduction } from '../../lib/env-var';
import prisma from '../../lib/prisma';
import { builder } from '../builder';

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    communityList: t.relation('communityList'),
  }),
});

const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
});

builder.queryField('userCurrent', (t) =>
  t.prismaField({
    type: 'User',
    resolve: async (query, parent, args, ctx, info) => {
      const { user } = await ctx;
      const { email } = user;

      let entry = await prisma.user.findUnique({
        ...query,
        where: { email },
      });

      // Create user entry in database if not already available
      if (!entry) {
        entry = await prisma.user.create({
          data: {
            email,
            communityIds: [],
          },
        });
      }

      // In development mode, add all communities under 'devuser@email.com' to
      // the current context user
      // This will ensure that context user see everything that `yarn seed-db` has
      // created for devuser@email.com'
      if (!isProduction()) {
        const devCommunityList = await prisma.community.findMany({
          select: { id: true },
          where: {
            userList: {
              some: {
                email: 'devuser@email.com',
              },
            },
          },
        });
        await prisma.user.update({
          where: { id: entry.id },
          data: {
            communityList: {
              connect: devCommunityList,
            },
          },
        });
        entry = await prisma.user.findUnique({
          ...query,
          where: { id: entry.id },
        });
      }

      if (!entry) {
        throw new GraphQLError(`User ${email} not found in database`);
      }
      return entry;
    },
  })
);

// builder.queryField('userList', (t) =>
//   t.prismaField({
//     type: ['User'],
//     resolve: (query, _parent, _args, _ctx, _info) =>
//       prisma.user.findMany({ ...query }),
//   })
// );
