import { Job } from '@hokify/agenda';
import { Community, Property } from '@prisma/client';
import { GraphQLError } from 'graphql';
import {
  communityMinMaxYearUpdateArgs,
  getCommunityEntry,
} from '~/graphql/schema/community/util';
import { getGeoapifyApi } from '~/graphql/schema/geocode/util';
import { jobProgress, type JobProgressOutput } from '~/graphql/schema/job/util';
import { type ContextUser } from '~/lib/context-user';
import prisma from '~/lib/prisma';
import {
  findOrAddEvent,
  mapEventEntry,
  propertyListFindManyArgs,
} from '../util';
import {
  type BatchPropertyModifyInput,
  type BatchPropertyModifyJobArg,
} from './index';

const stepDefinition = {
  findPropertyList: 10,
  update: 20,
};

export class BatchModify {
  constructor(
    private user: ContextUser,
    private input: BatchPropertyModifyInput,
    private progress?: JobProgressOutput<typeof stepDefinition>
  ) {}

  static fromJob(job: Job<BatchPropertyModifyJobArg>) {
    const { user, input } = job?.attrs.data;
    const progress = jobProgress(job, stepDefinition);
    return new BatchModify(user, input, progress);
  }

  async start() {
    const { self, filter, method } = this.input;
    const shortId = self.id;

    this.progress?.findPropertyList.set(0);
    const community = await getCommunityEntry(this.user, shortId, {
      select: { id: true, shortId: true, minYear: true, maxYear: true },
    });

    const findManyArgs = await propertyListFindManyArgs(community.id, filter);
    const propertyList = await prisma.property.findMany(findManyArgs);
    this.progress?.findPropertyList.set(100);

    let updatedPropertyList: Property[];

    switch (method) {
      case 'ADD_EVENT':
        if (this.input.membership == null) {
          throw new GraphQLError(
            `Method ${method} requires input.membership to be specified`
          );
        }
        const result = await this.updateMembership(
          community,
          propertyList,
          this.input.membership
        );
        updatedPropertyList = result.updatedPropertyList;
        break;

      case 'ADD_GPS':
        if (this.input.gps == null) {
          throw new GraphQLError(
            `Method ${method} requires input.gps to be specified`
          );
        }
        updatedPropertyList = await this.updateGpsInfo(
          community,
          propertyList,
          this.input.gps
        );
        break;

      default:
        throw new GraphQLError(`Unhandled method "${method}" specified.`);
    }

    return updatedPropertyList;
  }

  /**
   * Process BatchMembershipInput for batch modify
   *
   * For:
   *
   * - Add event to groups of properties
   * - Modify existing membership to groups of properties
   */
  private async updateMembership(
    community: Pick<Community, 'id' | 'minYear' | 'maxYear'>,
    propertyList: Property[],
    input: NonNullable<BatchPropertyModifyInput['membership']>
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
      }
      // If a property has a Membership Fee entry, but does not have
      // Price information specified, the record will be updated with
      // the new Price information.
      membership.price ??= input.price ?? null;
    });

    const communityUpdateDataArgs = communityMinMaxYearUpdateArgs(
      community,
      input.year
    );

    await this.progress?.update.set(0);
    const [updatedCommunity, ...updatedPropertyList] =
      await prisma.$transaction([
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
              updatedBy: { connect: { email: this.user.email } },
              membershipList: property.membershipList,
            },
          })
        ),
      ]);

    await this.progress?.update.set(100);
    return {
      updatedCommunity,
      updatedPropertyList,
    };
  }

  private async updateGpsInfo(
    community: Pick<Community, 'shortId' | 'id'>,
    propertyList: Property[],
    input: NonNullable<BatchPropertyModifyInput['gps']>
  ) {
    await this.progress?.update.set(0);

    // Get geocode information for each address and update database with
    // information
    const api = await getGeoapifyApi(this.user, community.shortId);
    const addressList = propertyList.map((property) => {
      return [
        property.address,
        input.city ?? '',
        input.province ?? '',
        input.country ?? '',
      ].join(',');
    });
    const geocodeResults = await api.batchGeocode.searchFreeForm(
      addressList,
      // interpolate geocoding progress to (0-80)
      async (progress) => {
        await this.progress?.update.set(progress * 0.8);
      }
    );

    /**
     * For unknown reason, when updating >800 properties within a single
     * transaction, the transaction operation fails in production instance.
     * (works fine locally)
     *
     * Will update the properties without transaction, upside is that it would
     * allow progress report
     */
    const updatedPropertyList: Property[] = [];
    for (const [idx, property] of propertyList.entries()) {
      const geocode = geocodeResults[idx];
      const updatedProperty = await prisma.property.update({
        where: { id: property.id },
        data: {
          updatedBy: { connect: { email: this.user.email } },
          // It's possible that lat/lon cannot be found
          lat: geocode.lat?.toString() ?? null,
          lon: geocode.lon?.toString() ?? null,
        },
      });
      updatedPropertyList.push(updatedProperty);
      const progress = ((idx + 1) / propertyList.length) * 100;
      // interpolate progress to (80-100)
      await this.progress?.update.set(80 + progress * 0.2);
    }

    await this.progress?.update.set(100);
    return updatedPropertyList;
  }
}
