import { Property, Role, SupportedSelectItem } from '@prisma/client';
import { EJSON } from 'bson';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { resolveCustomOffsetConnection } from '../offset-pagination';
import { propertyRef } from '../property/object';

const supportedSelectItemRef = builder
  .objectRef<SupportedSelectItem>('SupportedSelectItem')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name', { nullable: false }),
      hidden: t.exposeBoolean('hidden', { nullable: true }),
    }),
  });

/**
 * Statistic for one address
 */
interface PropertyStat {
  /**
   * membership year associated to this entry
   */
  year: number;
  /**
   * event name where this address pays membership
   */
  joinEvent: string;
  /**
   * Other events this address participated in
   */
  otherEvents: string[];
  /**
   * Was this address also a member last year?
   */
  renew: boolean;
}

/**
 * Statistic for the community
 */
interface CommunityStat {
  /**
   * Minimum year represented in PropertyStat
   */
  minYear: number;
  /**
   * Minimum year represented in PropertyStat
   */
  maxYear: number;
  /**
   * List of property stats for this community
   */
  propertyStat: PropertyStat[];
}

const propertyStatRef = builder
  .objectRef<PropertyStat>('PropertyStat')
  .implement({
    fields: (t) => ({
      year: t.exposeInt('year'),
      joinEvent: t.exposeString('joinEvent'),
      otherEvents: t.exposeStringList('otherEvents'),
      renew: t.exposeBoolean('renew'),
    }),
  });

const communityStatRef = builder
  .objectRef<CommunityStat>('CommunityStat')
  .implement({
    fields: (t) => ({
      minYear: t.exposeInt('minYear'),
      maxYear: t.exposeInt('maxYear'),
      propertyStat: t.field({
        type: [propertyStatRef],
        resolve: (entry) => entry.propertyStat,
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
        const entry = await prisma.property.findFirstOrThrow({
          ...query,
          where: {
            shortId: args.id,
            communityId: parent.id,
          },
        });
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
          select: { membershipList: true },
        });
        let minYear = Infinity;
        let maxYear = -Infinity;
        const propertyStat = propertyList.flatMap(({ membershipList }) => {
          // For each address, go through all membership information
          // to collect statistic for each year
          const byYear: PropertyStat[] = [];
          membershipList.forEach((entry, idx) => {
            minYear = Math.min(minYear, entry.year);
            maxYear = Math.max(maxYear, entry.year);
            if (entry.isMember && entry.eventAttendedList.length) {
              const joinEvent = entry.eventAttendedList.shift()!;
              const otherEvent = entry.eventAttendedList;
              byYear.push({
                year: entry.year,
                joinEvent: joinEvent.eventName,
                otherEvents: otherEvent.map(({ eventName }) => eventName),
                renew: !!membershipList[idx + 1]?.isMember,
              });
            }
          });
          return byYear;
        });
        return {
          minYear,
          maxYear,
          propertyStat,
        };
      },
    }),
  }),
});
