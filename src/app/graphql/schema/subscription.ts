import { filter, pipe } from 'graphql-yoga';
import prisma from '~/lib/prisma';
import { builder } from '../builder';
import {
  MessageType,
  type PubSubCommunityEvent,
  type PubSubEvent,
  type PubSubPropertyEvent,
} from '../pubsub';

builder.enumType(MessageType, {
  name: 'MessageType',
});

const subscriptionEventRef = builder
  .interfaceRef<PubSubEvent>('SubscriptionEvent')
  .implement({
    fields: (t) => ({
      messageType: t.expose('messageType', {
        description: 'type of change triggering the subscription event',
        type: MessageType,
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
        id: t.arg.string({ description: 'Community short ID', required: true }),
      },
      subscribe: async (_parent, args, ctx) => {
        const { user, pubSub } = ctx;
        const communityId = args.id;
        return pipe(
          pubSub.subscribe(`community/${communityId}/`),
          filter((event) => {
            // Don't subscribe to events that context user publish themselves
            // return event.broadcasterId !== user.email;
            return true;
          })
        );
      },
      resolve: (event) => event,
    }),
    propertyInCommunity: t.field({
      description: 'Subscribe to changes to property for a given community',
      type: propertyEventRef,
      nullable: true,
      args: {
        communityId: t.arg.string({ required: true }),
      },
      subscribe: async (_parent, args, ctx) => {
        const { user, pubSub } = ctx;
        return pipe(
          pubSub.subscribe(`community/${args.communityId}/property`),
          filter((event) => {
            // Don't subscribe to events that context user publish themselves
            // return event.broadcasterId !== user.email;
            return true;
          })
        );
      },
      resolve: (event) => event,
    }),
  }),
});
