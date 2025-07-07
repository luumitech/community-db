import { Property, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import { GeoapifyApi } from '~/lib/geoapify-api';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { getCommunityEntry } from '../community/util';

const PropertyCompleteGpsInput = builder.inputType('PropertyCompleteGpsInput', {
  fields: (t) => ({
    communityId: t.string({ required: true }),
  }),
});

interface PropertyCompleteGpsPayload {
  propertyList: Property[];
}

const propertyCompleteGpsPayloadRef = builder
  .objectRef<PropertyCompleteGpsPayload>('PropertyCompleteGpsPayload')
  .implement({
    fields: (t) => ({
      propertyList: t.prismaField({
        type: ['Property'],
        resolve: (query, result, args, ctx) => result.propertyList,
      }),
    }),
  });

builder.mutationField('propertyCompleteGps', (t) =>
  t.field({
    type: propertyCompleteGpsPayloadRef,
    description:
      'For property without GPS information, complete its GPS information using the address',
    args: {
      input: t.arg({ type: PropertyCompleteGpsInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const { input } = args;
      const { communityId: shortId } = input;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      const community = await getCommunityEntry(user, shortId, {
        select: { id: true, propertyList: true },
      });

      // Get list of properties missing GPS information
      const propertyList = community.propertyList.filter((property) => {
        return !property.lat || !property.lon;
      });

      // Get geocode information for each address and update database with
      // information
      const api = await GeoapifyApi.fromConfig();
      const addressList = propertyList.map((property) => property.address);
      const results = await api.batchGeocode.searchFreeForm(addressList);

      const [...updatedPropertyList] = await prisma.$transaction([
        ...propertyList.map((property, idx) => {
          const geocodeResult = results[idx];
          // It's possible that lat/lon cannot be found
          return prisma.property.update({
            where: { id: property.id },
            data: {
              updatedBy: { connect: { email: user.email } },
              lat: geocodeResult.lat?.toString() ?? null,
              lon: geocodeResult.lon?.toString() ?? null,
            },
          });
        }),
      ]);

      // broadcast modification to property(s)
      updatedPropertyList.forEach((property) => {
        pubSub.publish(`community/${shortId}/property`, {
          broadcasterId: user.email,
          messageType: MessageType.UPDATED,
          property,
        });
      });

      return {
        propertyList: updatedPropertyList,
      };
    },
  })
);
