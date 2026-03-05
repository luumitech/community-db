import { filter, pipe } from 'graphql-yoga';
import { builder } from '../../builder';
import { type PubSubCommunityEvent } from '../../pubsub';
import { subscriptionEventRef } from '../subscription';

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

builder.subscriptionField('communityFromId', (t) =>
  t.field({
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
  })
);
