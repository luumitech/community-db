import { Role } from '@prisma/client';
import { EJSON, ObjectId } from 'bson';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MutationType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { getCommunityEntry } from '../community/util';
import { getPropertyEntry, propertySearchQuery } from './util';

const OccupantInput = builder.inputType('OccupantInput', {
  fields: (t) => ({
    firstName: t.string(),
    lastName: t.string(),
    optOut: t.boolean(),
    email: t.string(),
    cell: t.string(),
    work: t.string(),
    home: t.string(),
  }),
});

const EventInput = builder.inputType('EventInput', {
  fields: (t) => ({
    eventName: t.string({ required: true }),
    eventDate: t.string({ required: true }),
  }),
});

const MembershipInput = builder.inputType('MembershipInput', {
  fields: (t) => ({
    year: t.int({ required: true }),
    isMember: t.boolean(),
    eventAttendedList: t.field({ type: [EventInput] }),
    paymentMethod: t.string(),
    paymentDeposited: t.boolean(),
  }),
});

const PropertyModifyInput = builder.inputType('PropertyModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    address: t.string(),
    streetNo: t.string(),
    streetName: t.string(),
    postalCode: t.string(),
    notes: t.string(),
    occupantList: t.field({ type: [OccupantInput] }),
    membershipList: t.field({ type: [MembershipInput] }),
  }),
});

builder.mutationField('propertyModify', (t) =>
  t.prismaField({
    type: 'Property',
    args: {
      input: t.arg({ type: PropertyModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user, pubSub } = await ctx;
      const { self, ...input } = args.input;
      const shortId = self.id;

      const entry = await getPropertyEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
          community: {
            select: {
              shortId: true,
              minYear: true,
              maxYear: true,
            },
          },
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale property ${shortId}, please refresh browser.`
        );
      }

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId: entry.community.shortId }, [
        Role.ADMIN,
        Role.EDITOR,
      ]);

      // Check if community min/max year needs to be updated
      let minYear: number | undefined;
      let maxYear: number | undefined;
      if (input.membershipList?.length) {
        const len = input.membershipList.length;
        const listMinYear = input.membershipList[len - 1].year;
        const listMaxYear = input.membershipList[0].year;
        if (!entry.community.minYear || listMinYear < entry.community.minYear) {
          minYear = listMinYear;
        }
        if (!entry.community.maxYear || listMaxYear > entry.community.maxYear) {
          maxYear = listMaxYear;
        }
      }

      const property = await prisma.property.update({
        ...query,
        where: {
          id: entry.id,
        },
        // @ts-expect-error: composite types like 'occupantList'
        // is allowed to be undefined
        data: {
          updatedBy: { connect: { email: user.email } },
          ...input,
          ...((minYear != null || maxYear != null) && {
            community: {
              update: {
                ...(minYear != null && { minYear }),
                ...(maxYear != null && { maxYear }),
              },
            },
          }),
        },
      });

      // broadcast modification to property
      pubSub.publish(`community/${entry.community.shortId}/property`, {
        broadcasterId: user.email,
        mutationType: MutationType.UPDATED,
        property,
      });
      return property;
    },
  })
);

const BatchPropertyFilterInput = builder.inputType('BatchPropertyFilterInput', {
  fields: (t) => ({
    communityId: t.string({ required: true }),
    // The properties below should match those in community.propertyList query
    searchText: t.string(),
    memberYear: t.int(),
    memberEvent: t.string(),
  }),
});

const BatchPropertyModifyInput = builder.inputType('BatchPropertyModifyInput', {
  fields: (t) => ({
    filter: t.field({ type: BatchPropertyFilterInput, required: true }),
    membership: t.field({ type: MembershipInput }),
  }),
});

builder.mutationField('batchPropertyModify', (t) =>
  t.prismaField({
    type: ['Property'],
    args: {
      input: t.arg({ type: BatchPropertyModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user, pubSub } = await ctx;
      const { filter } = args.input;

      // Make sure user has permission to modify
      const shortId = filter.communityId;
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      const community = await getCommunityEntry(user, shortId, {
        select: { id: true },
      });

      const searchQuery = propertySearchQuery(filter);
      const propertyListResult = await prisma.property.findRaw({
        filter: {
          communityId: { $oid: community.id },
          ...searchQuery,
        },
        options: {
          projection: { _id: true },
        },
      });
      // findRaw returns propertyListResult encoded in EJSON format
      // i.e.
      // - [{"_id": {"$oid": "xxx" }}]
      const propertyList: { _id: ObjectId }[] = EJSON.parse(
        EJSON.stringify(propertyListResult)
      );

      const result = await prisma.property.findMany({
        where: { id: { in: propertyList.map(({ _id }) => _id.toHexString()) } },
      });

      return result;
    },
  })
);
