import { type CommunityFromIdQuery } from '~/graphql/generated/graphql';

export type CommunityEntry = CommunityFromIdQuery['communityFromId'];
export type PropertyEntry =
  CommunityEntry['propertyList']['edges'][number]['node'];
