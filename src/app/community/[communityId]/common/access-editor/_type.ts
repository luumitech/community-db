import { type CommunityAccessEditorQuery } from '~/graphql/generated/types';

export type CommunityEntry = CommunityAccessEditorQuery['communityFromId'];

export type AccessEntry = {
  /** Indicates if the access entry is owner of community */
  isOwner?: boolean;
  /**
   * Added after otherAccessList is retrieved, to indicate if the access entry
   * is owned by context user
   */
  isSelf?: boolean;
} & CommunityEntry['otherAccessList'][number];
