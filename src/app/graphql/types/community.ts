import { GraphQLError } from 'graphql';
import prisma from '../../lib/prisma';
import { builder } from '../builder';

builder.prismaObject('Community', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: false }),
    userList: t.relation('userList'),
    /**
     * Relay cursor pagination for propertyList
     */
    propertyConnectionList: t.relatedConnection('propertyList', {
      cursor: 'id',
      totalCount: true,
    }),
    /**
     * Offset pagination for propertyList
     */
    propertyCount: t.relationCount('propertyList'),
    propertyList: t.relation('propertyList', {
      args: {
        offset: t.arg.int({ required: true }),
        limit: t.arg.int({ required: true }),
      },
      query: (args, ctx) => {
        const skip = args.offset ?? 0;
        const take = args.limit ?? 10;
        return { skip, take };
      },
    }),
  }),
});

builder.queryField('communityFromId', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, ctx) => {
      const { user } = await ctx;
      const entry = await prisma.community.findUniqueOrThrow({
        ...query,
        where: {
          id: args.id.toString(),
          OR: [
            {
              userList: {
                some: {
                  email: user.email,
                },
              },
            },
          ],
        },
      });

      return entry;
    },
  })
);

builder.mutationField('communityCreate', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = await ctx;
      const { email } = user;

      return prisma.community.create({
        ...query,
        data: {
          ...args,
          userList: { connect: [{ email }] },
        },
      });
    },
  })
);
