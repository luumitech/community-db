import prisma from '~/lib/prisma';
import { builder } from '../builder';
import { MessageType, type PubSubEvent } from '../pubsub';

builder.enumType(MessageType, {
  name: 'MessageType',
});

export const subscriptionEventRef = builder
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
