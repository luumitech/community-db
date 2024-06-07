import { Prisma, Property } from '@prisma/client';
import { EJSON } from 'bson';
import { GraphQLError } from 'graphql';
import prisma from '../../lib/prisma';
import { builder } from '../builder';
import { UpdateInput } from './common';
import { communityStatRef, type PropertyStat } from './community-stat';
import { resolveCustomOffsetConnection } from './offset-pagination';
import { propertyRef } from './property';

builder.prismaObject('Community', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: false }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.exposeString('updatedBy', { nullable: true }),
    eventList: t.exposeStringList('eventList'),
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
                      { $sort: { _id: 1 } },
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
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, parent, args, ctx) => {
        const entry = await prisma.property.findFirstOrThrow({
          ...query,
          where: {
            id: args.id.toString(),
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

builder.queryField('communityFromId', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, parent, args, ctx) => {
      const { user } = await ctx;
      try {
        const entry = await prisma.community.findUniqueOrThrow({
          ...query,
          where: {
            id: args.id.toString(),
            OR: [
              {
                accessList: {
                  some: {
                    user: {
                      email: user.email,
                    },
                  },
                },
              },
            ],
          },
        });
        return entry;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          switch (err.code) {
            /**
             * https://www.prisma.io/docs/orm/reference/error-reference#p2025
             */
            case 'P2025':
              throw new GraphQLError(
                `Community ${args.id.toString()} Not Found`
              );
          }
        }
        throw err;
      }
    },
  })
);

builder.mutationField('communityCreate', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = await ctx;
      const { email } = user;

      const entry = await prisma.community.create({
        ...query,
        data: {
          ...args,
          accessList: {
            create: {
              role: 'ADMIN',
              user: { connect: { email } },
            },
          },
        },
      });
      return entry;
    },
  })
);

const CommunityModifyInput = builder.inputType('CommunityModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    name: t.string(),
    eventList: t.stringList(),
  }),
});

builder.mutationField('communityModify', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      input: t.arg({ type: CommunityModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = await ctx;
      const { self, ...input } = args.input;
      const entry = await prisma.community.findUnique({
        ...query,
        where: {
          id: self.id.toString(),
          accessList: {
            some: {
              user: { email: user.email },
            },
          },
        },
        select: {
          updatedAt: true,
        },
      });
      if (!entry) {
        throw new GraphQLError(
          `No permission to access community ${self.id.toString()}`
        );
      } else if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale community ${self.id.toString()}, please refresh browser.`
        );
      }

      const { name, eventList, ...optionalInput } = input;
      return prisma.community.update({
        ...query,
        where: {
          id: self.id.toString(),
        },
        data: {
          updatedBy: user.email,
          // non-nullable fields needs to be specified explicitly
          ...(!!name && { name }),
          ...(!!eventList && { eventList }),
          ...optionalInput,
        },
      });
    },
  })
);

const CommunityDeletePayload = builder
  .objectRef<{ id: string }>('CommunityDeletePayload')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id', {}),
    }),
  });

builder.mutationField('communityDelete', (t) =>
  t.field({
    type: CommunityDeletePayload,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user } = await ctx;
      const entry = await prisma.community.findUnique({
        where: {
          id: args.id.toString(),
          accessList: {
            some: {
              user: { email: user.email },
            },
          },
        },
      });
      if (!entry) {
        throw new GraphQLError(
          `No permission to access community ${args.id.toString()}`
        );
      }

      const [access, property, community] = await prisma.$transaction([
        prisma.access.deleteMany({
          where: {
            communityId: args.id.toString(),
          },
        }),
        prisma.property.deleteMany({
          where: {
            communityId: args.id.toString(),
          },
        }),
        prisma.community.delete({
          where: {
            id: args.id.toString(),
          },
        }),
      ]);
      return community;
    },
  })
);
