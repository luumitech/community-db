import prisma from '../../../lib/prisma';
import { builder } from '../../builder';
import { getCommunityEntry } from './util';

const communityDeletePayloadRef = builder
  .objectRef<{ id: string }>('CommunityDeletePayload')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id', {}),
    }),
  });

builder.mutationField('communityDelete', (t) =>
  t.field({
    type: communityDeletePayloadRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user } = await ctx;
      // Verify access to community
      await getCommunityEntry(user, args.id.toString());

      const [access, property, community] = await prisma.$transaction([
        prisma.access.deleteMany({
          where: {
            communityId: args.id.toString(),
          },
        }),
        prisma.property.deleteMany({
          where: {
            communityId: args.id.toString(),
          },
        }),
        prisma.community.delete({
          where: {
            id: args.id.toString(),
          },
        }),
      ]);
      return community;
    },
  })
);
