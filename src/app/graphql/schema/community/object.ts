import { ApolloError } from '@apollo/client';
import { Property, Role, SupportedSelectItem } from '@prisma/client';
import { EJSON, ObjectId } from 'bson';
import { GraphQLError } from 'graphql';
import hash from 'object-hash';
import * as R from 'remeda';
import { builder } from '~/graphql/builder';
import { DEFAULT_PROPERTY_ORDER_BY } from '~/graphql/schema/property/util';
import { getCurrentYear } from '~/lib/date-util';
import { insertIf } from '~/lib/insert-if';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { resolveCustomOffsetConnection } from '../offset-pagination';
import { getCommunityOwnerSubscriptionEntry } from '../payment/util';
import { propertyRef } from '../property/object';
import {
  getPropertyEntryWithinCommunity,
  isMember,
  isMemberInYear,
  propertySearchQuery,
} from '../property/util';

const supportedSelectItemRef = builder
  .objectRef<SupportedSelectItem>('SupportedSelectItem')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name', { nullable: false }),
      hidden: t.exposeBoolean('hidden', { nullable: true }),
    }),
  });

/** Member count statistic for each year */
interface MemberCountStat {
  /** Membership year associated to this entry */
  year: number;
  /** Number of households who renewed this year */
  renew: number;
  /** Number of households who joined this year as new member */
  new: number;
  /** Number of households who were member last year, but did not renew this year */
  noRenewal: number;
}

/** Event statistics for a given year */
interface EventStat {
  /** Event name associated to this entry */
  eventName: string;
  /** Members who renewed via this event */
  renew: number;
  /** Members who newly joined member via this event */
  new: number;
  /** Members who have already joined */
  existing: number;
}

/** Statistic for the community */
interface CommunityStat {
  /**
   * Unique id representing membership information for all properties within
   * this community
   */
  id: string;
  /** Community Id */
  communityId: string;
  /** Minimum year represented in membership information */
  minYear: number;
  /** Maximum year represented in membership information */
  maxYear: number;
  /** List of all properties within this community */
  propertyList: Pick<Property, 'id' | 'membershipList'>[];
  /** List of all events */
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
      dbSize: t.field({
        description: 'bytes used to store all properties within community',
        type: 'Int',
        resolve: async (parent, args, ctx) => {
          const { communityId } = parent;
          const aggr = await prisma.property.aggregateRaw({
            pipeline: [
              { $match: { communityId: { $oid: communityId } } },
              {
                $group: { _id: null, size: { $sum: { $bsonSize: '$$ROOT' } } },
              },
            ],
          });
          // aggregateRaw returns items encoded in EJSON format
          // So it's necessary to convert it back to normal JSON
          const result: {
            size: number;
          }[] = EJSON.parse(EJSON.stringify(aggr));
          return result[0].size;
        },
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
            membershipList.forEach((entry, idx) => {
              const { year } = entry;
              const entryIsMember = isMember(entry);
              const mapEntry = map.get(year);
              if (!mapEntry) {
                throw new GraphQLError(
                  `year ${year} in propertyStat entry fell outside min/maxYear`
                );
              }
              const isMemberLastYear = isMember(membershipList[idx + 1]);
              if (isMemberLastYear) {
                if (entryIsMember) {
                  mapEntry.renew++;
                } else {
                  mapEntry.noRenewal++;
                }
              } else if (entryIsMember) {
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
              if (entry.year === year && isMember(entry)) {
                const renew = !!isMember(membershipList[idx + 1]);
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
              const isMemberCurrentYear = isMemberInYear(
                membershipList,
                args.year
              );
              const isMemberPrevYear = isMemberInYear(
                membershipList,
                args.year - 1
              );
              if (isMemberPrevYear && !isMemberCurrentYear) {
                return id;
              }
              return null;
            })
            .filter((id): id is string => id != null);
          return prisma.property.findMany({
            where: { id: { in: propertyIdList } },
            orderBy: DEFAULT_PROPERTY_ORDER_BY,
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
              const isMemberCurrentYear = isMemberInYear(
                membershipList,
                args.year
              );
              return isMemberCurrentYear ? null : id;
            })
            .filter((id): id is string => id != null);
          return prisma.property.findMany({
            where: { id: { in: propertyIdList } },
            orderBy: DEFAULT_PROPERTY_ORDER_BY,
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
              const isMemberCurrentYear = isMemberInYear(
                membershipList,
                args.year
              );
              return isMemberCurrentYear ? id : null;
            })
            .filter((id): id is string => id != null);
          return prisma.property.findMany({
            where: { id: { in: propertyIdList } },
            orderBy: DEFAULT_PROPERTY_ORDER_BY,
          });
        },
      }),
    }),
  });

builder.prismaObject('Community', {
  fields: (t) => ({
    id: t.exposeString('shortId'),
    name: t.exposeString('name', { nullable: false }),
    owner: t.relation('owner'),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.relation('updatedBy', { nullable: true }),
    minYear: t.field({
      type: 'Int',
      description: 'Minimum year represented in membership information',
      resolve: (entry) => entry.minYear ?? getCurrentYear(),
    }),
    maxYear: t.field({
      type: 'Int',
      description: 'Maximum year represented in membership information',
      resolve: (entry) => entry.maxYear ?? getCurrentYear(),
    }),
    eventList: t.field({
      type: [supportedSelectItemRef],
      resolve: (entry) => entry.eventList,
    }),
    paymentMethodList: t.field({
      type: [supportedSelectItemRef],
      resolve: (entry) => entry.paymentMethodList,
    }),
    /** Return context user's access document */
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
    /** Return other user's access documents */
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
     * Generate relay style pagination using offset/limit arguments
     *
     * Use custom implementation to enable text search
     */
    propertyList: t.connection({
      type: propertyRef,
      args: {
        searchText: t.arg.string({
          description: 'Match against property address/first name/last name',
        }),
        memberYear: t.arg.int({
          description: 'Only property who is a member of the given year',
        }),
        memberEvent: t.arg.string({
          description: 'Only property who attended this event',
        }),
      },
      resolve: async (parent, args, ctx) => {
        const { user } = await ctx;
        return await resolveCustomOffsetConnection(
          { args },
          async ({ limit, offset }) => {
            /**
             * Get application configuration base on community owner's
             * subscription level
             */
            const subEntry = await getCommunityOwnerSubscriptionEntry(
              parent.id
            );
            const { propertyLimit } = subEntry;
            const limitQuery = insertIf(propertyLimit != null, {
              $limit: propertyLimit,
            });

            const aggr = await prisma.property.aggregateRaw({
              pipeline: [
                ...limitQuery,
                {
                  $match: {
                    // connection parameter
                    communityId: { $oid: parent.id },
                    // If search term is provided, construct $match query
                    // for returning matched entries
                    ...propertySearchQuery(args),
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
     * Relay cursor pagination for propertyList easy to implement, but does not
     * support full text search
     */
    // propertyConnectionList: t.relatedConnection('propertyList', {
    //   cursor: 'id',
    //   totalCount: true,
    // }),
    /** Select a property by ID */
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
     * Return statistics for community Primary purpose is for rendering
     * dashboard information
     */
    communityStat: t.field({
      type: communityStatRef,
      resolve: async (parent, args, ctx) => {
        const communityId = parent.id;
        const propertyList = await prisma.property.findMany({
          where: { communityId },
          select: { id: true, membershipList: true },
        });

        return {
          id: hash(propertyList),
          minYear: parent.minYear ?? getCurrentYear(),
          maxYear: parent.maxYear ?? getCurrentYear(),
          communityId,
          eventList: parent.eventList,
          propertyList,
        };
      },
    }),
  }),
});
