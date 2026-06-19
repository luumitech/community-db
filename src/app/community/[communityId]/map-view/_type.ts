import { type MapViewCommunityQuery } from '~/graphql/generated/types';

export type CommunityEntry = MapViewCommunityQuery['communityFromId'];
export type PropertyEntry = CommunityEntry['rawPropertyList'][number];
export type MembershipList = PropertyEntry['membershipList'];
export type MemberCountStat =
  CommunityEntry['communityStat']['memberCountStat'][number];
