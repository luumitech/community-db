import { filter, pipe } from 'graphql-yoga';
import prisma from '../../lib/prisma';
import { builder } from '../builder';
import {
  MutationType,
  type PubSubCommunityEvent,
  type PubSubEvent,
  type PubSubPropertyEvent,
} from '../pubsub';

builder.enumType(MutationType, {
  name: 'MutationType',
});

const subscriptionEventRef = builder
  .interfaceRef<PubSubEvent>('SubscriptionEvent')
  .implement({
    fields: (t) => ({
      mutationType: t.exposeString('mutationType', {
        description: 'type of change triggering the subscription event',
      }),
      broadcaster: t.prismaField({
        description: 'event publisher user information',
        type: 'User',
        resolve: (query, event, args, ctx) => {
          const { broadcasterId } = event;
          return prisma.user.findUniqueOrThrow({
            where: { email: broadcasterId },
          });
        },
      }),
    }),
  });

const communityEventRef = builder
  .objectRef<PubSubCommunityEvent>('SubscriptionCommunityEvent')
  .implement({
    interfaces: [subscriptionEventRef],
    fields: (t) => ({
      community: t.prismaField({
        type: 'Community',
        nullable: true,
        resolve: (query, event, args, ctx) => {
          const { community } = event;
          return community;
        },
      }),
    }),
  });

const propertyEventRef = builder
  .objectRef<PubSubPropertyEvent>('SubscriptionPropertyEvent')
  .implement({
    interfaces: [subscriptionEventRef],
    fields: (t) => ({
      property: t.prismaField({
        type: 'Property',
        nullable: true,
        resolve: (query, event, args, ctx) => {
          const { property } = event;
          return property;
        },
      }),
    }),
  });

builder.subscriptionType({
  fields: (t) => ({
    communityFromId: t.field({
      description: 'Subscribe to changes for a given community',
      type: communityEventRef,
      nullable: true,
      args: {
        id: t.arg.id({ description: 'Community ID', required: true }),
      },
      subscribe: async (_parent, args, ctx) => {
        const { user, pubSub } = await ctx;
        const communityId = args.id.toString();
        return pipe(
          pubSub.subscribe(`community/${communityId}/`),
          // Don't subscribe to events that context user publish themselves
          filter((event) => event.broadcasterId !== user.email)
        );
      },
      resolve: (event) => event,
    }),
    propertyInCommunity: t.field({
      description: 'Subscribe to changes to property for a given community',
      type: propertyEventRef,
      nullable: true,
      args: {
        communityId: t.arg.id({ required: true }),
      },
      subscribe: async (_parent, args, ctx) => {
        const { user, pubSub } = await ctx;
        return pipe(
          pubSub.subscribe(`community/${args.communityId.toString()}/property`),
          // Don't subscribe to events that context user publish themselves
          filter((event) => event.broadcasterId !== user.email)
        );
      },
      resolve: (event) => event,
    }),
  }),
});
