import { type CommunityAccessListQuery } from '~/graphql/generated/graphql';

export type AccessEntry = {
  /** Indicates if the access entry is owner of community */
  isOwner?: boolean;
  /**
   * Added after otherAccessList is retrieved, to indicate if the access entry
   * is owned by context user
   */
  isSelf?: boolean;
} & CommunityAccessListQuery['communityFromId']['otherAccessList'][0];
