import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import { Logger } from '~/lib/logger';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { getCommunityEntry } from './util';

const logger = Logger('graphql/schema/community/modify-owner');

const CommunityModifyOwnerInput = builder.inputType(
  'CommunityModifyOwnerInput',
  {
    fields: (t) => ({
      self: t.field({ type: UpdateInput, required: true }),
      ownerId: t.string({ required: true }),
    }),
  }
);

builder.mutationField('communityOwnerModify', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      input: t.arg({ type: CommunityModifyOwnerInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const { self, ...input } = args.input;
      const shortId = self.id;
      const entry = await getCommunityEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale community ${shortId}, please refresh browser.`
        );
      }

      // Make sure user has permission to modify
      await verifyAccess(user, { id: entry.id }, [Role.ADMIN]);

      const { ownerId } = input;

      const community = await prisma.community.update({
        ...query,
        where: {
          id: entry.id,
        },
        data: {
          updatedBy: { connect: { email: user.email } },
          owner: { connect: { id: ownerId } },
        },
      });

      // broadcast modification to community
      pubSub.publish(`community/${shortId}/`, {
        broadcasterId: user.email,
        messageType: MessageType.UPDATED,
        community,
      });

      return community;
    },
  })
);
