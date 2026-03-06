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
}

/**
 * Ideally, I want to
 *
 * ```ts
 * // Use the graphql-yoga's native typing
 * const pubSub = createPubSub<PubSubEventsImpl>();
 * ```
 *
 * But I'm getting the error:
 *
 *     Index signature for type 'string' is missing in type 'PubSubEventsImpl'
 *
 * So I'm manufacturing the correct types manually
 */
const _pubSub = createPubSub();
export const pubSub = {
  publish<TKey extends keyof PubSubEventsImpl>(
    key: TKey,
    ...args: PubSubEventsImpl[TKey]
  ): void {
    _pubSub.publish(key as string, ...(args as [unknown]));
  },
  subscribe<TKey extends keyof PubSubEventsImpl>(
    key: TKey
  ): AsyncIterable<PubSubEventsImpl[TKey][0]> {
    return _pubSub.subscribe(key) as AsyncIterable<PubSubEventsImpl[TKey][0]>;
  },
};
