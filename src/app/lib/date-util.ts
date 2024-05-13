import * as GQL from '~/graphql/generated/graphql';

type GQLDateTime = GQL.Scalars['DateTime']['output'];
type GQLDate = GQL.Scalars['Date']['output'];

/**
 * Given a DateTime string, return a date time local string
 *
 * @param input ISOString (i.e. 2024-05-13T15:58:12.957Z)
 * @returns date/time string (i.e. 5/13/24, 1:58:12 PM)
 */
export function toLocalDateTime(input: GQLDateTime) {
  const date = new Date(input);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}
