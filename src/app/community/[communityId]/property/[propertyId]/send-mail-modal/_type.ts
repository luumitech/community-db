import * as GQL from '~/graphql/generated/graphql';

export type OccupantList =
  GQL.RegisterEventMutation['registerEvent']['property']['occupantList'];
