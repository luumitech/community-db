import { MaybePromise } from '@pothos/core';
import {
  DefaultConnectionArguments,
  resolveOffsetConnection,
} from '@pothos/plugin-relay';
import { GraphQLError } from 'graphql';
import { builder } from '../builder';

/**
 * Implement additional properties to default pothos offset/limit
 * connection (i.e. resolveOffsetConnection):
 * - total number pages
 */
builder.globalConnectionField('totalCount', (t) =>
  t.int({
    nullable: false,
    resolve: ({ totalCount }) => totalCount,
  })
);

interface CustomOffsetConnectionResult<T> {
  items: T[];
  totalCount: number;
}

export async function resolveCustomOffsetConnection<T>(
  options: {
    args: DefaultConnectionArguments;
    defaultSize?: number;
    maxSize?: number;
  },
  resolve: (params: {
    offset: number;
    limit: number;
  }) => MaybePromise<CustomOffsetConnectionResult<T>>
) {
  let totalCount = 0;

  const result = await resolveOffsetConnection(
    options,
    async ({ limit, offset }) => {
      const res = await resolve({ limit, offset });
      totalCount = res.totalCount;
      return res.items;
    }
  );

  return { ...result, totalCount };
}
