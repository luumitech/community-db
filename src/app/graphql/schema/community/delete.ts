import { Role } from '@prisma/client';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
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
      const { user, pubSub } = ctx;

      // Make sure user has permission to delete
      await verifyAccess(user, { shortId: args.id }, [Role.ADMIN]);

      // Verify access to community
      const community = await getCommunityEntry(user, args.id);

      /**
       * Delete the community
       *
       * Prisma will cascade deletion to all referencing entities, like any
       * Property and Access documents that reference this community
       */
      await prisma.community.delete({ where: { id: community.id } });

      // broadcast deletion to community
      pubSub.publish(`community/${community.shortId}/`, {
        broadcasterId: user.email,
        messageType: MessageType.DELETED,
        community,
      });

      return community;
    },
  })
);
