import {
  DefaultSetting,
  EmailSetting,
  Property,
  Role,
  SupportedEventItem,
  SupportedPaymentMethod,
  SupportedTicketItem,
} from '@prisma/client';
import { EJSON, ObjectId } from 'bson';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { getCurrentYear } from '~/lib/date-util';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { resolveCustomOffsetConnection } from '../offset-pagination';
import { PropertyFilterInput } from '../property/batch-modify';
import { propertyRef } from '../property/object';
import {
  getPropertyEntryWithinCommunity,
  propertyListFindManyArgs,
} from '../property/util';
import {
  StatUtil,
  type ByYearStat,
  type MemberSourceStat,
  type MembershipFeeStat,
  type TicketInfoStat,
} from './stat-util';

interface CommunityStat {
  /**
   * Unique id representing membership information for all properties within
   * this community
   */
  id: string;
  /** Community Id */
  communityId: string;
  /** Community statistics */
  statUtil: StatUtil;
}

const emailSettingRef = builder
  .objectRef<EmailSetting>('EmailSetting')
  .implement({
    fields: (t) => ({
      subject: t.exposeString('subject'),
      cc: t.exposeStringList('cc', { nullable: true }),
      message: t.exposeString('message'),
    }),
  });

const defaultSettingRef = builder
  .objectRef<DefaultSetting>('DefaultSetting')
  .implement({
    fields: (t) => ({
      membershipFee: t.exposeString('membershipFee', { nullable: true }),
      membershipEmail: t.field({
        type: emailSettingRef,
        nullable: true,
        resolve: (entry) => entry.membershipEmail,
      }),
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

const byYearStatRef = builder.objectRef<ByYearStat>('ByYearStat').implement({
  fields: (t) => ({
    year: t.exposeInt('year', {
      description: 'membership year for this entry',
    }),
    renew: t.exposeInt('renew', {
      description: 'number of members who renewed this year',
    }),
    new: t.exposeInt('new', {
      description: 'number of members who joined this year as new member',
    }),
    noRenewal: t.exposeInt('noRenewal', {
      description:
        'number of members who were member last year but did not renew this year',
    }),
  }),
});

const memberSourceStatRef = builder
  .objectRef<MemberSourceStat>('MemberSourceStat')
  .implement({
    fields: (t) => ({
      eventName: t.exposeString('eventName', {
        description: 'event name for this entry',
      }),
      existing: t.exposeInt('existing', {
        description: 'number of members who attended event as a member',
      }),
      new: t.exposeInt('new', {
        description: 'number of members who joined membership at the event',
      }),
      renew: t.exposeInt('renew', {
        description: 'number of members who renewed membership at the event',
      }),
    }),
  });

const membershipFeeStatRef = builder
  .objectRef<MembershipFeeStat>('MembershipFeeStat')
  .implement({
    fields: (t) => ({
      key: t.exposeString('key', {
        description: 'unique key for entry',
      }),
      membershipYear: t.exposeInt('membershipYear', {
        description: 'membership year associated with the membership fee',
      }),
      eventName: t.exposeString('eventName', {
        description: 'event name where membership fee is collected',
      }),
      paymentMethod: t.exposeString('paymentMethod', {
        description: 'payment method used to purchase membership',
      }),
      count: t.exposeInt('count', {
        description: 'number of memberships',
      }),
      price: t.exposeString('price', {
        description: 'membership fee total',
      }),
    }),
  });

const ticketInfoStatRef = builder
  .objectRef<TicketInfoStat>('TicketInfoStat')
  .implement({
    fields: (t) => ({
      key: t.exposeString('key', {
        description: 'unique key for entry',
      }),
      ticketName: t.exposeString('ticketName', {
        description: 'ticket name',
      }),
      membershipYear: t.exposeInt('membershipYear', {
        description: 'Membership Year when ticket is purchased',
      }),
      eventName: t.exposeString('eventName', {
        description: 'Event name where ticket is purchased',
      }),
      paymentMethod: t.exposeString('paymentMethod', {
        description: 'payment method used to purchase ticket',
      }),
      count: t.exposeInt('count', {
        description: 'tickets sold count',
      }),
      price: t.exposeString('price', {
        description: 'tickets sold price',
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
          const result = EJSON.parse(EJSON.stringify(aggr)) as {
            size: number;
          }[];
          return result[0].size;
        },
      }),
      memberCountStat: t.field({
        description: 'Member count statistic for each year',
        type: [byYearStatRef],
        resolve: (parent, args, ctx) => {
          const { statUtil } = parent;
          return statUtil.memberCountStat();
        },
      }),
      memberSourceStat: t.field({
        description: 'Member source statistics for each event name',
        args: {
          year: t.arg.int({
            required: true,
            description: 'year to retrieve statistics for',
          }),
        },
        type: [memberSourceStatRef],
        resolve: (parent, args, ctx) => {
          const { year } = args;
          const { statUtil } = parent;
          return statUtil.memberSourceStat(year);
        },
      }),
      membershipFeeStat: t.field({
        description: 'Membership Fee statistics for the specified year',
        type: [membershipFeeStatRef],
        args: {
          year: t.arg.int({
            required: true,
            description: 'year to retrieve statistics for',
          }),
        },
        resolve: async (parent, args, ctx) => {
          const { year } = args;
          const { statUtil } = parent;
          return statUtil.membershipFeeStat(year);
        },
      }),
      ticketStat: t.field({
        description: 'ticket statistics for the specified year',
        type: [ticketInfoStatRef],
        args: {
          year: t.arg.int({
            required: true,
            description: 'year to retrieve statistics for',
          }),
        },
        resolve: async (parent, args, ctx) => {
          const { year } = args;
          const { statUtil } = parent;
          return statUtil.ticketStat(year);
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
        const statUtil = new StatUtil(parent, propertyList);

        return {
          id: parent.shortId,
          communityId,
          statUtil,
        };
      },
    }),
  }),
});
