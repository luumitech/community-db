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
    community: t.field({
      description: 'Subscribe to changes to the given community',
      type: communityEventRef,
      nullable: true,
      args: {
        id: t.arg.id({ description: 'Community ID', required: true }),
      },
      subscribe: async (_parent, args, ctx) => {
        const { pubSub } = await ctx;
        return pubSub.subscribe(`community/${args.id.toString()}/`);
      },
      resolve: (event) => event,
    }),
    property: t.field({
      description: 'Subscribe to changes to the given property',
      type: propertyEventRef,
      nullable: true,
      args: {
        communityId: t.arg.id({ required: true }),
      },
      subscribe: async (_parent, args, ctx) => {
        const { pubSub } = await ctx;
        return pubSub.subscribe(
          `community/${args.communityId.toString()}/property`
        );
      },
      resolve: (event) => event,
    }),
  }),
});
