import type { FieldPolicy, Reference } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import * as R from 'remeda';

type KeyArgs = FieldPolicy<unknown>['keyArgs'];

/**
 * typePolicy for offset/limit based pagination.
 * Returns entire list (entries not yet loaded will be null)
 */
export function customOffsetLimitPagination<T = Reference>(
  keyArgs?: KeyArgs
): FieldPolicy<T[]> {
  return {
    ...offsetLimitPagination(),
    keyArgs: false,
    read(existing, { canRead }) {
      const result = existing ? existing.slice(0) : [];
      /**
       * Replace empty slots with null
       * See: https://github.com/apollographql/apollo-client/issues/6628
       */
      R.times(result.length, (idx) => {
        const entry = result[idx];
        result[idx] = canRead(entry as Reference) ? entry : (null as T);
      });
      return result;
    },
  };
}
