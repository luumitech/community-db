import * as GQL from '~/graphql/generated/types';

export type OccupantEntry =
  GQL.PropertyId_OccupantDisplayFragment['occupantList'][number] & {
    id: string;
  };

export type ContactInfoEntry = NonNullable<OccupantEntry['infoList']>[number];
