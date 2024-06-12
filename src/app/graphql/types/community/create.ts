import prisma from '../../../lib/prisma';
import { builder } from '../../builder';
import { getCommunityEntry } from './util';

builder.mutationField('communityCreate', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = await ctx;
      const { uid } = user;

      const entry = await prisma.community.create({
        ...query,
        data: {
          ...args,
          accessList: {
            create: {
              role: 'ADMIN',
              user: { connect: { uid } },
            },
          },
        },
      });
      return entry;
    },
  })
);
