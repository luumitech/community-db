import {
  DefaultSetting,
  Role,
  SupportedEventItem,
  SupportedPaymentMethod,
  SupportedTicketItem,
} from '@prisma/client';
import { EJSON, ObjectId } from 'bson';
import { GraphQLError } from 'graphql';
import hash from 'object-hash';
import { builder } from '~/graphql/builder';
import { getCurrentYear } from '~/lib/date-util';
import { isNonZeroDec } from '~/lib/decimal-util';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { resolveCustomOffsetConnection } from '../offset-pagination';
import { PropertyFilterInput } from '../property/modify';
import { propertyRef } from '../property/object';
import {
  getPropertyEntryWithinCommunity,
  propertyListFindManyArgs,
} from '../property/util';
import {
  StatUtil,
  type CommunityStat,
  type EventStat,
  type MemberCountStat,
  type TicketStat,
} from './stat-util';

const defaultSettingRef = builder
  .objectRef<DefaultSetting>('DefaultSetting')
  .implement({
    fields: (t) => ({
      membershipFee: t.exposeString('membershipFee', { nullable: true }),
    }),
  });

const supportedEventItemRef = builder
  .objectRef<SupportedEventItem>('SupportedEventItem')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name', { nullable: false }),
      hidden: t.exposeBoolean('hidden', { nullable: true }),
    }),
  });

const supportedTicketItemRef = builder
  .objectRef<SupportedTicketItem>('SupportedTicketItem')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name', { nullable: false }),
      count: t.exposeInt('count', { nullable: true }),
      unitPrice: t.exposeString('unitPrice', { nullable: true }),
      hidden: t.exposeBoolean('hidden', { nullable: true }),
    }),
  });

const supportedPaymentMethodRef = builder
  .objectRef<SupportedPaymentMethod>('SupportedPaymentMethod')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name', { nullable: false }),
      hidden: t.exposeBoolean('hidden', { nullable: true }),
    }),
  });

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

const ticketStatRef = builder.objectRef<TicketStat>('TicketStat').implement({
  fields: (t) => ({
    ticketName: t.exposeString('ticketName', {
      description: 'ticket name',
    }),
    count: t.exposeInt('count', {
      description: 'tickets sold count',
    }),
    price: t.exposeString('price', {
      description: 'tickets sold price',
    }),
    paymentMethod: t.exposeString('paymentMethod', {
      description: 'payment method used to purchase ticket',
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
    ticketList: t.field({
      description: 'ticket statistics for this event',
      type: [ticketStatRef],
      resolve: async (parent, args, ctx) => {
        const { ticketMap } = parent;
        return (
          Array.from(ticketMap, ([, mapEntry]) => {
            return Array.from(mapEntry, ([, ticketEntry]) => ticketEntry);
          })
            .flat()
            // Only keep entries with +ve count or non zero price
            .filter((entry) => {
              return entry.count > 0 || isNonZeroDec(entry.price);
            })
        );
      },
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
          const statUtil = new StatUtil(parent);
          const statMap = statUtil.getMemberCountStatMap();
          return Array.from(statMap, ([, mapEntry]) => mapEntry);
        },
      }),
      eventStat: t.field({
        description: 'Event statistics for a given year',
        args: {
          year: t.arg.int({
            required: true,
            description: 'year to retrieve statistics for',
          }),
        },
        type: [eventStatRef],
        resolve: (parent, args, ctx) => {
          const { year } = args;
          const statUtil = new StatUtil(parent);
          const statMap = statUtil.getEventStatMap(year);
          return Array.from(statMap, ([, entry]) => entry);
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
      type: [supportedEventItemRef],
      resolve: (entry) => entry.eventList,
    }),
    ticketList: t.field({
      type: [supportedTicketItemRef],
      resolve: (entry) => entry.ticketList,
    }),
    paymentMethodList: t.field({
      type: [supportedPaymentMethodRef],
      resolve: (entry) => entry.paymentMethodList,
    }),
    defaultSetting: t.field({
      type: defaultSettingRef,
      nullable: true,
      resolve: (entry) => entry.defaultSetting,
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
        filter: t.arg({ type: PropertyFilterInput }),
      },
      resolve: async (parent, args, ctx) => {
        const { user } = await ctx;
        return await resolveCustomOffsetConnection(
          { args },
          async ({ limit, offset }) => {
            const { filter } = args;
            const findManyArgs = await propertyListFindManyArgs(
              parent.id,
              filter
            );
            const [items, totalCount] = await prisma.$transaction([
              prisma.property.findMany({
                ...findManyArgs,
                skip: offset,
                take: limit,
              }),
              prisma.property.count({ where: findManyArgs.where }),
            ]);

            return { items, totalCount };
          }
        );
      },
    }),
    /** Generate property list in normal array currently used to get email list */
    rawPropertyList: t.prismaField({
      type: ['Property'],
      description: 'Properties that satisfies the specifed filter',
      args: {
        filter: t.arg({ type: PropertyFilterInput }),
      },
      resolve: async (query, parent, args, ctx) => {
        const { filter } = args;
        const findManyArgs = await propertyListFindManyArgs(parent.id, filter);
        const propertyList = await prisma.property.findMany({
          ...query,
          ...findManyArgs,
        });
        return propertyList;
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
          supportedEventList: parent.eventList,
          supportedTicketList: parent.ticketList,
          supportedPaymentMethods: parent.paymentMethodList,
          propertyList,
        };
      },
    }),
  }),
});
