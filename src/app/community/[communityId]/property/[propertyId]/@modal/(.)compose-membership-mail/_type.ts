import * as GQL from '~/graphql/generated/types';

export type OccupantList =
  GQL.RegisterEventMutation['registerEvent']['property']['occupantList'];
