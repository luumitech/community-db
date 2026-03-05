import { filter, pipe } from 'graphql-yoga';
import { builder } from '../../builder';
import { type PubSubPropertyEvent } from '../../pubsub';
import { subscriptionEventRef } from '../subscription';

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

builder.subscriptionField('propertyInCommunity', (t) =>
  t.field({
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
  })
);
