import * as GQL from '~/graphql/generated/graphql';

export type OccupantEntry =
  GQL.PropertyId_OccupantDisplayFragment['occupantList'][number];

export type ContactInfoEntry = NonNullable<OccupantEntry['infoList']>[number];
