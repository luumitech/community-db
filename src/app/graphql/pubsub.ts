/**
 * Graphql-Yoga pubsub
 */
import { createPubSub } from '@graphql-yoga/subscription';
import type { Community, Property } from '@prisma/client';

// See: https://the-guild.dev/graphql/yoga-server/tutorial/advanced/02-subscriptions#subscribing-to-new-link-elements
export enum MutationType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export interface PubSubEvent {
  mutationType: MutationType;
}

export interface PubSubCommunityEvent extends PubSubEvent {
  community: Community;
}

export interface PubSubPropertyEvent extends PubSubEvent {
  property: Property;
}

interface PubSubEventsImpl {
  // arg is communityId
  [key: `community/${string}/`]: [PubSubCommunityEvent];
  // arg is communityId
  [key: `community/${string}/property`]: [PubSubPropertyEvent];
}
type ValueOf<T> = T[keyof T];

type PubSubEvents = PubSubEventsImpl &
  Record<string, ValueOf<PubSubEventsImpl>>;

export const pubSub = createPubSub<PubSubEvents>();
