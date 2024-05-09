import { Property } from '@prisma/client';
import { EJSON } from 'bson';
import { GraphQLError } from 'graphql';
import prisma from '../../lib/prisma';
import { builder } from '../builder';
import { resolveCustomOffsetConnection } from './offset-pagination';
import { propertyRef } from './property';

interface PropertListAggrResult {
  items: Property[];
  info: {
    totalCount: number;
  }[];
}

builder.prismaObject('Community', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: false }),
    userList: t.relation('userList'),
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
            const result: PropertListAggrResult[] = EJSON.parse(
              EJSON.stringify(aggr)
            );
            const { items, info } = result[0];
            const totalCount = info[0]?.totalCount ?? 0;
            return { items, totalCount };
          }
        );
      },
    }),
    /**
     * Example way to introduce custom fields
     */
    // propertyTestList: t.prismaField({
    //   type: ['Property'],
    //   args: {
    //     offset: t.arg.int({ required: true }),
    //     limit: t.arg.int({ required: true }),
    //   },
    //   resolve: async (query, parent, args, ctx) => {
    //     const where = { communityId: parent.id };
    //     const list = await prisma.property.findMany({
    //       ...query,
    //       where,
    //       take: args.limit,
    //       skip: args.offset,
    //     });
    //     const count = await prisma.property.count({
    //       where,
    //     });
    //     console.log({ count });
    //     return list;
    //   },
    // }),
    /**
     * Relay cursor pagination for propertyList
     */
    // propertyConnectionList: t.relatedConnection('propertyList', {
    //   cursor: 'id',
    //   totalCount: true,
    // }),
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
      const entry = await prisma.community.findUniqueOrThrow({
        ...query,
        where: {
          id: args.id.toString(),
          OR: [
            {
              userList: {
                some: {
                  email: user.email,
                },
              },
            },
          ],
        },
      });

      return entry;
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

      return prisma.community.create({
        ...query,
        data: {
          ...args,
          userList: { connect: [{ email }] },
        },
      });
    },
  })
);
