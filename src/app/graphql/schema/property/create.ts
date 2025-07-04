import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { getCommunityEntry } from '../community/util';
import { getSubscriptionEntry } from '../payment/util';

const PropertyCreateInput = builder.inputType('PropertyCreateInput', {
  fields: (t) => ({
    communityId: t.string({
      description: 'community short ID',
      required: true,
    }),
    address: t.string({ description: 'property address', required: true }),
    streetNo: t.int({ description: 'street number' }),
    streetName: t.string({ description: 'street name', required: true }),
    postalCode: t.string({ description: 'postal code' }),
    city: t.string({ description: 'city' }),
    country: t.string({ description: 'country' }),
    lat: t.string({ description: 'GPS latitude' }),
    lon: t.string({ description: 'GPS longitude' }),
  }),
});

builder.mutationField('propertyCreate', (t) =>
  t.prismaField({
    type: 'Property',
    args: {
      input: t.arg({ type: PropertyCreateInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = ctx;
      const { communityId, ...input } = args.input;

      // Make sure user has permission to create
      await verifyAccess(user, { shortId: communityId }, [Role.ADMIN]);

      // Cannot connect to community with shortId, so retrieve
      // the document directly
      const community = await getCommunityEntry(user, communityId, {
        select: { id: true, owner: true },
      });

      // Check community owner's subscription status to determine
      // limitation
      const existingSub = await getSubscriptionEntry(community.owner);
      const { propertyLimit } = existingSub;
      if (propertyLimit != null) {
        const propertyCount = await prisma.property.count({
          where: { community: { id: community.id } },
        });
        if (propertyCount >= propertyLimit) {
          throw new GraphQLError(
            `This community can at most have ${propertyLimit} properties.`
          );
        }
      }

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
