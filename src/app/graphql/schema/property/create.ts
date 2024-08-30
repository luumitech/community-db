import { Role } from '@prisma/client';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { getCommunityEntry } from '../community/util';

const PropertyCreateInput = builder.inputType('PropertyCreateInput', {
  fields: (t) => ({
    communityId: t.string({
      description: 'community short ID',
      required: true,
    }),
    address: t.string({ description: 'property address', required: true }),
    streetNo: t.string({ description: 'street number', required: true }),
    streetName: t.string({ description: 'street name', required: true }),
    postalCode: t.string({ description: 'postal code' }),
  }),
});

builder.mutationField('propertyCreate', (t) =>
  t.prismaField({
    type: 'Property',
    args: {
      input: t.arg({ type: PropertyCreateInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = await ctx;
      const { communityId, ...input } = args.input;

      // Make sure user has permission to create
      await verifyAccess(user, { shortId: communityId }, [Role.ADMIN]);

      // Cannot connect to community with shortId, so retrieve
      // the document directly
      const community = await getCommunityEntry(user, communityId, {
        select: { id: true },
      });
      const entry = await prisma.property.create({
        ...query,
        data: {
          ...input,
          community: {
            connect: { id: community.id },
          },
        },
      });
      return entry;
    },
  })
);
