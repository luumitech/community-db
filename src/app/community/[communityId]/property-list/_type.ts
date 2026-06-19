import { type CommunityFromIdQuery } from '~/graphql/generated/types';

export type CommunityEntry = CommunityFromIdQuery['communityFromId'];
export type PropertyEntry =
  CommunityEntry['propertyList']['edges'][number]['node'];
