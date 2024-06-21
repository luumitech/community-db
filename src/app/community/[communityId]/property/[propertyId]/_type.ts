import { type PropertyFromIdQuery } from '~/graphql/generated/graphql';

export type PropertyEntry =
  PropertyFromIdQuery['communityFromId']['propertyFromId'];
