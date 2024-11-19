import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { getCommunityEntry } from './util';

builder.queryField('communityFromId', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, parent, args, ctx) => {
      const { user } = await ctx;

      const entry = await getCommunityEntry(user, args.id, query);
      return entry;
    },
  })
);
