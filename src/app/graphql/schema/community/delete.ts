import { builder } from '~/graphql/builder';
import { MutationType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
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
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = await ctx;
      // Verify access to community
      const entry = await getCommunityEntry(user, args.id);

      const [access, property, community] = await prisma.$transaction([
        prisma.access.deleteMany({
          where: {
            communityId: entry.id,
          },
        }),
        prisma.property.deleteMany({
          where: {
            communityId: entry.id,
          },
        }),
        prisma.community.delete({
          where: {
            id: entry.id,
          },
        }),
      ]);

      // broadcast deletion to community
      pubSub.publish(`community/${entry.shortId}/`, {
        broadcasterId: user.email,
        mutationType: MutationType.DELETED,
        community,
      });

      return community;
    },
  })
);
