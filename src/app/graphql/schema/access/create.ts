import { Role } from '@prisma/client';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { getCommunityEntry } from '../community/util';
import { roleRef } from './object';
import { createAccess, verifyAccess } from './util';

const AccessCreateInput = builder.inputType('AccessCreateInput', {
  fields: (t) => ({
    communityId: t.string({ description: 'community ID', required: true }),
    email: t.string({ required: true }),
    role: t.field({
      description: 'Access role',
      type: roleRef,
      required: true,
    }),
  }),
});

builder.mutationField('accessCreate', (t) =>
  t.prismaField({
    type: 'Access',
    args: {
      input: t.arg({ type: AccessCreateInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = ctx;
      const { input } = args;
      const { role, email, communityId } = input;

      // Verify if user has permission to create access document
      await verifyAccess(user, { shortId: communityId }, [Role.ADMIN]);

      // Cannot connect to community with shortId, so retrieve
      // the document directly
      const community = await getCommunityEntry(user, communityId);
      const entry = await createAccess(community.id, email, role, query);
      return entry;
    },
  })
);
