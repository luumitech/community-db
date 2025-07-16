import { Job } from '@hokify/agenda';
import { Community, Property } from '@prisma/client';
import { GraphQLError } from 'graphql';
import {
  communityMinMaxYearUpdateArgs,
  getCommunityEntry,
} from '~/graphql/schema/community/util';
import { type ContextUser } from '~/lib/context-user';
import { GeoapifyApi } from '~/lib/geoapify-api';
import prisma from '~/lib/prisma';
import { StepProgress } from '~/lib/step-progress';
import {
  findOrAddEvent,
  mapEventEntry,
  propertyListFindManyArgs,
} from '../util';
import {
  type BatchPropertyModifyInput,
  type BatchPropertyModifyJobArg,
} from './';

export class BatchModify {
  public progress;

  constructor(
    private user: ContextUser,
    private input: BatchPropertyModifyInput,
    onProgress?: (progress: number) => Promise<void>
  ) {
    this.progress = StepProgress.fromSteps(
      {
        findProperty: 30,
        update: 90,
        cleanup: 100,
      },
      async (progress) => {
        await onProgress?.(progress);
      }
    );
  }

  static fromJob(job: Job<BatchPropertyModifyJobArg>) {
    const { user, input } = job?.attrs.data;
    return new BatchModify(user, input, (progress) =>
      job.touch(Math.ceil(progress))
    );
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
    this.progress.update.set(0);

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

    this.progress.update.set(80);
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

    this.progress.update.set(100);
    return {
      updatedCommunity,
      updatedPropertyList,
    };
  }

  private async updateGpsInfo(
    community: Pick<Community, 'id'>,
    propertyList: Property[],
    input: NonNullable<BatchPropertyModifyInput['gps']>
  ) {
    this.progress.update.set(0);

    // Get geocode information for each address and update database with
    // information
    const api = await GeoapifyApi.fromConfig();
    const addressList = propertyList.map((property) => {
      return [property.address, input.city ?? '', input.country ?? ''].join(
        ','
      );
    });
    const results = await api.batchGeocode.searchFreeForm(
      addressList,
      // interpolate geocoding progress to specified range
      (progress) => this.progress.update.set(progress * 0.8)
    );

    const [...updatedPropertyList] = await prisma.$transaction([
      ...propertyList.map((property, idx) => {
        const geocodeResult = results[idx];
        return prisma.property.update({
          where: { id: property.id },
          data: {
            updatedBy: { connect: { email: this.user.email } },
            // It's possible that lat/lon cannot be found
            lat: geocodeResult.lat?.toString() ?? null,
            lon: geocodeResult.lon?.toString() ?? null,
          },
        });
      }),
    ]);

    this.progress.update.set(100);
    return updatedPropertyList;
  }

  async modify() {
    const { self, filter, method } = this.input;
    const shortId = self.id;
    this.progress.findProperty.set(10);

    const community = await getCommunityEntry(this.user, shortId, {
      select: { id: true, minYear: true, maxYear: true },
    });

    const findManyArgs = await propertyListFindManyArgs(community.id, filter);
    const propertyList = await prisma.property.findMany(findManyArgs);

    this.progress.findProperty.set(100);
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

    // Done
    this.progress.cleanup.set(100);
    return updatedPropertyList;
  }
}
