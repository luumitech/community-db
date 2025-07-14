import { Job } from '@hokify/agenda';
import { Community, Property, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { type ContextUser } from '~/lib/context-user';
import { GeoapifyApi } from '~/lib/geoapify-api';
import { JobHandler } from '~/lib/job-handler';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import {
  communityMinMaxYearUpdateArgs,
  getCommunityEntry,
} from '../community/util';
import { jobPayloadRef } from '../job/object';
import { EventInput } from './modify';
import {
  findOrAddEvent,
  mapEventEntry,
  propertyListFindManyArgs,
} from './util';

export const PropertyFilterInput = builder.inputType('PropertyFilterInput', {
  fields: (t) => ({
    searchText: t.string({
      description: 'Match against property address/first name/last name',
    }),
    memberYear: t.int({
      description: 'Only property who is a member of the given year',
    }),
    nonMemberYear: t.int({
      description: 'Only property who is NOT a member of the given year',
    }),
    memberEvent: t.string({
      description: 'Only property who attended this event',
    }),
    withGps: t.boolean({
      description:
        'If true, properties with GPS.  If false, properties without GPS',
    }),
  }),
});

const BatchMembershipInput = builder.inputType('BatchMembershipInput', {
  fields: (t) => ({
    year: t.int({ required: true }),
    eventAttended: t.field({ type: EventInput, required: true }),
    paymentMethod: t.string({ required: true }),
    price: t.string(),
  }),
});

const batchModifyMethodRef = builder.enumType('BatchModifyMethod', {
  values: ['ADD_EVENT', 'ADD_GPS'] as const,
});

const BatchGpsInput = builder.inputType('BatchGpsInput', {
  fields: (t) => ({
    city: t.string(),
    country: t.string(),
  }),
});

const BatchPropertyModifyInput = builder.inputType('BatchPropertyModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    method: t.field({ type: batchModifyMethodRef, required: true }),
    filter: t.field({ type: PropertyFilterInput }),
    membership: t.field({ type: BatchMembershipInput }),
    gps: t.field({ type: BatchGpsInput }),
  }),
});

builder.mutationField('batchPropertyModify', (t) =>
  t.field({
    type: jobPayloadRef,
    args: {
      input: t.arg({ type: BatchPropertyModifyInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const { input } = args;
      const shortId = input.self.id;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      const agenda = await JobHandler.init();

      const job = await agenda.start<BatchPropertyModifyJobArg>(
        'batchPropertyModify',
        { user, input }
      );

      return job;
    },
  })
);

type BatchPropertyModifyInput = typeof BatchPropertyModifyInput.$inferInput;
interface BatchPropertyModifyJobArg {
  user: ContextUser;
  input: BatchPropertyModifyInput;
}

/**
 * Process BatchMembershipInput for batch modify
 *
 * For:
 *
 * - Add event to groups of properties
 * - Modify existing membership to groups of properties
 */
async function updateMembership(
  user: ContextUser,
  community: Pick<Community, 'id' | 'minYear' | 'maxYear'>,
  propertyList: Property[],
  input: typeof BatchMembershipInput.$inferInput
) {
  // Modify the propertyList in memory, and then write them to
  // database afterwards
  propertyList.forEach(({ membershipList }) => {
    const result = findOrAddEvent(
      membershipList,
      input.year,
      input.eventAttended.eventName
    );
    const membership = membershipList[result.membershipIdx];
    if (result.isNewEvent) {
      membership.eventAttendedList[result.eventIdx] = mapEventEntry(
        input.eventAttended
      );
    }
    if (result.isNewMember) {
      // Membership Fee will only be applied to properties
      // that do not have an existing membership
      membership.price = input.price ?? null;
      membership.paymentMethod = input.paymentMethod;
    } else if (membership.price == null) {
      // If a property has a Membership Fee entry, but does not have
      // Price information specified, the record will be updated with
      // the new Price information.
      membership.price = input.price ?? null;
    }
  });

  const communityUpdateDataArgs = communityMinMaxYearUpdateArgs(
    community,
    input.year
  );

  const [updatedCommunity, ...updatedPropertyList] = await prisma.$transaction([
    // Update minYear/maxYear when appropriate
    communityUpdateDataArgs == null
      ? prisma.community.findUniqueOrThrow({
          where: { id: community.id },
        })
      : prisma.community.update({
          where: { id: community.id },
          data: communityUpdateDataArgs,
        }),
    ...propertyList.map((property) =>
      prisma.property.update({
        where: { id: property.id },
        data: {
          updatedBy: { connect: { email: user.email } },
          membershipList: property.membershipList,
        },
      })
    ),
  ]);

  return {
    updatedCommunity,
    updatedPropertyList,
  };
}

async function updateGpsInfo(
  user: ContextUser,
  community: Pick<Community, 'id'>,
  propertyList: Property[],
  input: typeof BatchGpsInput.$inferInput
) {
  // Get geocode information for each address and update database with
  // information
  const api = await GeoapifyApi.fromConfig();
  const addressList = propertyList.map((property) => {
    return [property.address, input.city ?? '', input.country ?? ''].join(',');
  });
  const results = await api.batchGeocode.searchFreeForm(addressList);

  const [...updatedPropertyList] = await prisma.$transaction([
    ...propertyList.map((property, idx) => {
      const geocodeResult = results[idx];
      return prisma.property.update({
        where: { id: property.id },
        data: {
          updatedBy: { connect: { email: user.email } },
          // It's possible that lat/lon cannot be found
          lat: geocodeResult.lat?.toString() ?? null,
          lon: geocodeResult.lon?.toString() ?? null,
        },
      });
    }),
  ]);

  return updatedPropertyList;
}

export async function batchPropertyModify(
  user: ContextUser,
  input: BatchPropertyModifyInput,
  job?: Job<BatchPropertyModifyJobArg>
) {
  const { self, filter, method } = input;
  const shortId = self.id;

  const community = await getCommunityEntry(user, shortId, {
    select: { id: true, minYear: true, maxYear: true },
  });

  const findManyArgs = await propertyListFindManyArgs(community.id, filter);
  const propertyList = await prisma.property.findMany(findManyArgs);

  let updatedPropertyList: Property[];

  await job?.touch(30);

  switch (method) {
    case 'ADD_EVENT':
      if (input.membership == null) {
        throw new GraphQLError(
          `Method ${method} requires input.membership to be specified`
        );
      }
      const result = await updateMembership(
        user,
        community,
        propertyList,
        input.membership
      );
      updatedPropertyList = result.updatedPropertyList;
      break;

    case 'ADD_GPS':
      if (input.gps == null) {
        throw new GraphQLError(
          `Method ${method} requires input.gps to be specified`
        );
      }
      updatedPropertyList = await updateGpsInfo(
        user,
        community,
        propertyList,
        input.gps
      );

      break;

    default:
      throw new GraphQLError(`Unhandled method "${method}" specified.`);
  }

  await job?.touch(100);
  return updatedPropertyList;
}

export async function batchPropertyModifyTask(
  job: Job<BatchPropertyModifyJobArg>
) {
  const { user, input } = job.attrs.data;

  const propertyList = await batchPropertyModify(user, input, job);
  /**
   * Would be nice to store this information in agenda queue output, so we can
   * display number of properties modified by the batch command. But I don't
   * think this is currently possible
   */
  return propertyList.length;
}
