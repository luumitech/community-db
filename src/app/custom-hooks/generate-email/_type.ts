import * as GQL from '~/graphql/generated/graphql';

export type PropertyEntry =
  GQL.GenerateEmailPropertyListQuery['communityFromId']['rawPropertyList'][0];
export type OccupantEntry = PropertyEntry['occupantList'][0];
