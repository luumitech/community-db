import { type PropertyFromIdQuery } from '~/graphql/generated/graphql';

export type CommunityEntry = PropertyFromIdQuery['communityFromId'];
export type PropertyEntry = CommunityEntry['propertyFromId'];
