/** Graphql-Yoga pubsub */
import { createPubSub } from '@graphql-yoga/subscription';
import type { Community, Property } from '@prisma/client';
import type { JobEntry } from '~/lib/job-handler';

// See: https://the-guild.dev/graphql/yoga-server/tutorial/advanced/02-subscriptions#subscribing-to-new-link-elements
export enum MessageType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export interface PubSubEvent {
  /** Email (AuthContext) of broadcaster */
  broadcasterId: string;
  messageType: MessageType;
}

export interface PubSubCommunityEvent extends PubSubEvent {
  community: Community;
}

export interface PubSubPropertyEvent extends PubSubEvent {
  property: Property;
}

export interface PubSubJobProgressEvent extends PubSubEvent {
  job: JobEntry;
}

interface PubSubEventsImpl {
  [key: `community/${string}/`]: [PubSubCommunityEvent];
  [key: `community/${string}/property`]: [PubSubPropertyEvent];
  [key: `jobProgress/${string}/`]: [PubSubJobProgressEvent];
  [key: string]: [unknown];
}

export const pubSub = createPubSub<PubSubEventsImpl>();
