import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { UpdateInput } from '../common';
import { roleRef } from './object';
import { verifyAccess } from './util';

const AccessModifyInput = builder.inputType('AccessModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    role: t.field({
      description: 'Access role',
      type: roleRef,
      required: true,
    }),
  }),
});

builder.mutationField('accessModify', (t) =>
  t.prismaField({
    type: 'Access',
    args: {
      input: t.arg({ type: AccessModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = ctx;
      const { self, ...input } = args.input;

      const accessToModify = await prisma.access.findUniqueOrThrow({
        where: { id: self.id },
        select: { communityId: true },
      });

      // Verify if user has permission to modify access document
      await verifyAccess(user, { id: accessToModify.communityId }, [
        Role.ADMIN,
      ]);

      // Make sure there is at least one admin after the modification
      if (input.role !== 'ADMIN') {
        try {
          await prisma.access.findFirstOrThrow({
            where: {
              NOT: [{ id: self.id }],
              communityId: accessToModify.communityId,
              role: Role.ADMIN,
            },
          });
        } catch (err) {
          throw new GraphQLError(
            'You can not remove the only Admin from the access list'
          );
        }
      }

      const access = await prisma.access.update({
        ...query,
        where: { id: self.id },
        data: input,
      });

      return access;
    },
  })
);
