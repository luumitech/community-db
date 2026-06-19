import { type PropertyFromIdQuery } from '~/graphql/generated/types';

export type CommunityEntry = PropertyFromIdQuery['communityFromId'];
export type PropertyEntry = CommunityEntry['propertyFromId'];
