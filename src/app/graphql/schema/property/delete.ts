import { Role } from '@prisma/client';
import { builder } from '~/graphql/builder';
import { MutationType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { getPropertyEntry } from './util';

const propertyDeletePayloadRef = builder
  .objectRef<{ id: string }>('PropertyDeletePayload')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id', {}),
    }),
  });

builder.mutationField('propertyDelete', (t) =>
  t.field({
    type: propertyDeletePayloadRef,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = await ctx;

      const propertyShortId = args.id;

      const entry = await getPropertyEntry(user, propertyShortId, {
        select: {
          id: true,
          updatedAt: true,
          community: {
            select: {
              shortId: true,
            },
          },
        },
      });

      // Make sure user has permission to delete
      await verifyAccess(user, { shortId: entry.community.shortId }, [
        Role.ADMIN,
      ]);

      const property = await prisma.property.delete({
        where: { id: entry.id },
      });

      // broadcast deletion to community
      pubSub.publish(
        `community/${entry.community.shortId}/property/${propertyShortId}`,
        {
          broadcasterId: user.email,
          mutationType: MutationType.DELETED,
          property,
        }
      );

      return property;
    },
  })
);
