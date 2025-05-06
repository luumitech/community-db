import * as GQL from '~/graphql/generated/graphql';

export type PropertyEntry =
  GQL.GenerateEmailListPropertyListQuery['communityFromId']['rawPropertyList'][0];
export type OccupantEntry = PropertyEntry['occupantList'][0];
