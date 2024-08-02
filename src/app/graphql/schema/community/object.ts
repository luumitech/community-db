import { ApolloError } from '@apollo/client';
import { Property, Role, SupportedSelectItem } from '@prisma/client';
import { EJSON } from 'bson';
import { GraphQLError } from 'graphql';
import hash from 'object-hash';
import * as R from 'remeda';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { resolveCustomOffsetConnection } from '../offset-pagination';
import { propertyRef } from '../property/object';
import { getPropertyEntryWithinCommunity } from '../property/util';

const supportedSelectItemRef = builder
  .objectRef<SupportedSelectItem>('SupportedSelectItem')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name', { nullable: false }),
      hidden: t.exposeBoolean('hidden', { nullable: true }),
    }),
  });

/**
 * Member count statistic for each year
 */
interface MemberCountStat {
  /**
   * membership year associated to this entry
   */
  year: number;
  /**
   * Number of households who renewed this year
   */
  renew: number;
  /**
   * Number of households who joined this year as new member
   */
  new: number;
  /**
   * Number of households who were member last year, but did
   * not renew this year
   */
  noRenewal: number;
}

/**
 * Event statistics for a given year
 */
interface EventStat {
  /**
   * Event name associated to this entry
   */
  eventName: string;
  /**
   * members who renewed via this event
   */
  renew: number;
  /**
   * members who newly joined member via this event
   */
  new: number;
  /**
   * members who have already joined
   */
  existing: number;
}

/**
 * Statistic for the community
 */
interface CommunityStat {
  /**
   * unique id representing membership information for all properties
   * within this community
   */
  id: string;
  /**
   * Minimum year represented in membership information
   */
  minYear: number;
  /**
   * Maximum year represented in membership information
   */
  maxYear: number;
  /**
   * List of all properties within this community
   */
  propertyList: Pick<Property, 'id' | 'membershipList'>[];
  /**
   * List of all events
   */
  eventList: SupportedSelectItem[];
}

const memberCountStatRef = builder
  .objectRef<MemberCountStat>('MemberCountStat')
  .implement({
    fields: (t) => ({
      year: t.exposeInt('year', {
        description: 'membership year associated to this entry',
      }),
      renew: t.exposeInt('renew', {
        description:
          'member count who were member last year and renewed this year',
      }),
      new: t.exposeInt('new', {
        description: 'member count who joined this year as new member',
      }),
      noRenewal: t.exposeInt('noRenewal', {
        description:
          'member count who were member last year but did not renew this year',
      }),
    }),
  });

const eventStatRef = builder.objectRef<EventStat>('EventStat').implement({
  fields: (t) => ({
    eventName: t.exposeString('eventName', {
      description: 'event name',
    }),
    existing: t.exposeInt('existing', {
      description: 'member count who attended event as an existing member',
    }),
    new: t.exposeInt('new', {
      description: 'member count who joined as new member',
    }),
    renew: t.exposeInt('renew', {
      description: 'member count who renewed as a member',
    }),
  }),
});

const communityStatRef = builder
  .objectRef<CommunityStat>('CommunityStat')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      minYear: t.exposeInt('minYear', {
        description: 'Minimum year represented in membership information',
      }),
      maxYear: t.exposeInt('maxYear', {
        description: 'Maximum year represented in membership information',
      }),
      memberCountStat: t.field({
        description: 'Member count statistic for each year',
        type: [memberCountStatRef],
        resolve: (parent, args, ctx) => {
          const { minYear, maxYear, propertyList } = parent;
          const map = new Map<number, MemberCountStat>();
          R.range(minYear, maxYear + 1)
            .reverse()
            .forEach((year) => {
              map.set(year, { year, renew: 0, new: 0, noRenewal: 0 });
            });
          propertyList.forEach(({ membershipList }) => {
            membershipList.forEach(({ year, isMember }, idx) => {
              const mapEntry = map.get(year);
              if (!mapEntry) {
                throw new GraphQLError(
                  `year ${year} in propertyStat entry fell outside min/maxYear`
                );
              }
              const isMemberLastYear = !!membershipList[idx + 1]?.isMember;
              if (isMemberLastYear) {
                if (isMember) {
                  mapEntry.renew++;
                } else {
                  mapEntry.noRenewal++;
                }
              } else if (isMember) {
                mapEntry.new++;
              }
            });
          });
          return Array.from(map, ([, mapEntry]) => mapEntry);
        },
      }),
      eventStat: t.field({
        description: 'Event statistics for a given year',
        args: {
          year: t.arg.int({
            required: true,
            description: 'year to retrieve statistics for',
          }),
          showHidden: t.arg.boolean({
            description: 'return events that have been removed by user',
          }),
        },
        type: [eventStatRef],
        resolve: (parent, args, ctx) => {
          const { propertyList, eventList } = parent;
          const { year, showHidden } = args;
          const map = new Map<string, EventStat>();
          eventList.forEach(({ name, hidden }) => {
            if (!!showHidden || !hidden) {
              map.set(name, { eventName: name, new: 0, renew: 0, existing: 0 });
            }
          });

          propertyList.forEach(({ membershipList }) => {
            // For each address, go through all membership information
            // to collect statistic for each year
            membershipList.forEach((entry, idx) => {
              if (
                entry.year === year &&
                entry.isMember &&
                entry.eventAttendedList.length
              ) {
                const renew = !!membershipList[idx + 1]?.isMember;
                const joinEvent = entry.eventAttendedList.shift()!;
                const otherEvent = entry.eventAttendedList;

                const joinEntry = map.get(joinEvent.eventName);
                if (joinEntry) {
                  if (renew) {
                    joinEntry.renew++;
                  } else {
                    joinEntry.new++;
                  }
                }
                otherEvent.forEach((event) => {
                  const mapEntry = map.get(event.eventName);
                  if (mapEntry) {
                    mapEntry.existing++;
                  }
                });
              }
            });
          });
          return Array.from(map, ([, mapEntry]) => mapEntry);
        },
      }),
      noRenewalPropertyList: t.field({
        description:
          'Properties that did not renew membership in the current year',
        args: {
          year: t.arg.int({
            required: true,
            description: 'membership year of interest',
          }),
        },
        type: [propertyRef],
        resolve: (parent, args, ctx) => {
          const { propertyList } = parent;
          const propertyIdList = propertyList
            .map(({ id, membershipList }) => {
              const isMemberCurrentYear = !!membershipList.find(
                ({ year }) => year === args.year
              )?.isMember;
              const isMemberPrevYear = !!membershipList.find(
                ({ year }) => year === args.year - 1
              )?.isMember;
              if (isMemberPrevYear && !isMemberCurrentYear) {
                return id;
              }
              return null;
            })
            .filter((id): id is string => id != null);
          return prisma.property.findMany({
            where: { id: { in: propertyIdList } },
          });
        },
      }),
      nonMemberPropertyList: t.field({
        description: 'Properties that did not join membership this year',
        args: {
          year: t.arg.int({
            required: true,
            description: 'membership year of interest',
          }),
        },
        type: [propertyRef],
        resolve: (parent, args, ctx) => {
          const { propertyList } = parent;
          const propertyIdList = propertyList
            .map(({ id, membershipList }) => {
              const isMemberCurrentYear = !!membershipList.find(
                ({ year }) => year === args.year
              )?.isMember;
              return isMemberCurrentYear ? null : id;
            })
            .filter((id): id is string => id != null);
          return prisma.property.findMany({
            where: { id: { in: propertyIdList } },
          });
        },
      }),
      memberPropertyList: t.field({
        description: 'Properties that joined membership this year',
        args: {
          year: t.arg.int({
            required: true,
            description: 'membership year of interest',
          }),
        },
        type: [propertyRef],
        resolve: (parent, args, ctx) => {
          const { propertyList } = parent;
          const propertyIdList = propertyList
            .map(({ id, membershipList }) => {
              const isMemberCurrentYear = !!membershipList.find(
                ({ year }) => year === args.year
              )?.isMember;
              return isMemberCurrentYear ? id : null;
            })
            .filter((id): id is string => id != null);
          return prisma.property.findMany({
            where: { id: { in: propertyIdList } },
          });
        },
      }),
    }),
  });

builder.prismaObject('Community', {
  fields: (t) => ({
    id: t.exposeString('shortId'),
    name: t.exposeString('name', { nullable: false }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.relation('updatedBy', { nullable: true }),
    eventList: t.field({
      type: [supportedSelectItemRef],
      resolve: (entry) => entry.eventList,
    }),
    paymentMethodList: t.field({
      type: [supportedSelectItemRef],
      resolve: (entry) => entry.paymentMethodList,
    }),
    /**
     * Return context user's access document
     */
    access: t.prismaField({
      type: 'Access',
      resolve: async (query, parent, args, ctx) => {
        const { user } = await ctx;
        const access = await verifyAccess(
          user,
          { id: parent.id },
          // skip role verification
          Object.values(Role)
        );
        return access;
      },
    }),
    /**
     * Return other user's access documents
     */
    otherAccessList: t.prismaField({
      type: ['Access'],
      resolve: async (query, parent, args, ctx) => {
        const { user } = await ctx;
        const accessList = await prisma.access.findMany({
          where: {
            communityId: parent.id,
            user: { NOT: { email: user.email } },
          },
        });
        return accessList;
      },
    }),
    /**
     * Generate relay style pagination using
     * offset/limit arguments
     *
     * Use custom implementation to enable text search
     */
    propertyList: t.connection({
      type: propertyRef,
      args: {
        search: t.arg.string(),
      },
      resolve: async (parent, args, ctx) => {
        return await resolveCustomOffsetConnection(
          { args },
          async ({ limit, offset }) => {
            const aggr = await prisma.property.aggregateRaw({
              pipeline: [
                {
                  $match: {
                    // connection parameter
                    communityId: { $oid: parent.id },
                    // See this to see why we add the surrounding quotes
                    // See: https://www.mongodb.com/docs/manual/reference/operator/query/text/
                    ...(args.search && {
                      $text: { $search: `\"${args.search}\"` },
                    }),
                  },
                },
                {
                  $facet: {
                    items: [
                      // Sort must come before limit/skip, in order to sort all
                      // the matched results
                      { $sort: { streetName: 1, streetNo: 1 } },
                      { $limit: offset + limit },
                      { $skip: offset },
                      // map _id to id
                      { $addFields: { id: '$_id' } },
                    ],
                    info: [
                      // total number of matched results
                      { $count: 'totalCount' },
                    ],
                  },
                },
              ],
            });

            // aggregateRaw returns items encoded in EJSON format
            // i.e.
            // - {"updatedAt": {"$date": "2000-01-23T01:23:45.678+00:00"}}
            // - {"id": {"$oid": "xxx" }}
            // So it's necessary to convert it back to normal JSON
            const result: {
              items: Property[];
              info: {
                totalCount: number;
              }[];
            }[] = EJSON.parse(EJSON.stringify(aggr));
            const { items, info } = result[0];
            const totalCount = info[0]?.totalCount ?? 0;
            return { items, totalCount };
          }
        );
      },
    }),
    /**
     * Relay cursor pagination for propertyList
     * easy to implement, but does not support full text search
     */
    // propertyConnectionList: t.relatedConnection('propertyList', {
    //   cursor: 'id',
    //   totalCount: true,
    // }),
    /**
     * Select a property by ID
     */
    propertyFromId: t.prismaField({
      type: 'Property',
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, parent, args, ctx) => {
        const entry = await getPropertyEntryWithinCommunity(
          parent.id,
          args.id,
          query
        );
        return entry;
      },
    }),
    /**
     * Return statistics for community
     * Primary purpose is for rendering dashboard information
     */
    communityStat: t.field({
      type: communityStatRef,
      resolve: async (parent, args, ctx) => {
        const propertyList = await prisma.property.findMany({
          where: { communityId: parent.id },
          select: { id: true, membershipList: true },
        });
        let minYear = Infinity;
        let maxYear = -Infinity;
        propertyList.forEach(({ membershipList }) => {
          // For each property, go through all membership information
          // to determine min/max year
          membershipList.forEach((entry) => {
            minYear = Math.min(minYear, entry.year);
            maxYear = Math.max(maxYear, entry.year);
          });
        });

        return {
          id: hash(propertyList),
          minYear: isFinite(minYear) ? minYear : 0,
          maxYear: isFinite(maxYear) ? maxYear : 0,
          eventList: parent.eventList,
          propertyList,
        };
      },
    }),
  }),
});
