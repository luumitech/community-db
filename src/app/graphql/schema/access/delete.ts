import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { getCommunityEntry } from '../community/util';
import { verifyAccess } from './util';

const accessDeletePayloadRef = builder
  .objectRef<{ id: string }>('AccessDeletePayload')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id', {}),
    }),
  });

builder.mutationField('accessDelete', (t) =>
  t.field({
    type: accessDeletePayloadRef,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user } = await ctx;
      // Check community Id associated with the access Id
      const access = await prisma.access.findUniqueOrThrow({
        where: { id: args.id },
        select: { id: true, communityId: true },
      });

      // Verify if user has permission to delete access document
      const ownAccess = await verifyAccess(user, { id: access.communityId }, [
        Role.ADMIN,
      ]);

      // If removing your own access, make sure there is at least one
      // other admin in the access list for this community
      if (ownAccess.id === args.id) {
        try {
          await prisma.access.findFirstOrThrow({
            where: {
              NOT: [{ id: args.id }],
              communityId: access.communityId,
              role: Role.ADMIN,
            },
          });
        } catch (err) {
          throw new GraphQLError(
            'You can not remove the only Admin from the access list'
          );
        }
      }

      const result = await prisma.access.delete({
        where: {
          id: args.id,
        },
      });

      return result;
    },
  })
);
