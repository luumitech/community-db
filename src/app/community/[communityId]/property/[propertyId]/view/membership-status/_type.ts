import * as GQL from '~/graphql/generated/types';

export type MembershipEntry =
  GQL.PropertyId_MembershipStatusFragment['membershipList'][number];
