import { MaybePromise } from '@pothos/core';
import {
  DefaultConnectionArguments,
  offsetToCursor,
  resolveOffsetConnection,
} from '@pothos/plugin-relay';
import { GraphQLError } from 'graphql';
import { builder } from '../builder';

/**
 * Implement additional properties to default pothos offset/limit
 * connection (i.e. resolveOffsetConnection):
 * - total number pages
 * - cursor for last page
 */

export interface ListInfo {
  totalCount: number;
  pageCount: number;
}

const ListInfoRef = builder.objectRef<ListInfo>('ListInfo');
ListInfoRef.implement({
  fields: (t) => ({
    totalCount: t.exposeInt('totalCount'),
    pageCount: t.exposeInt('pageCount'),
  }),
});

builder.globalConnectionField('listInfo', (t) =>
  t.field({
    type: ListInfoRef,
    resolve: ({ listInfo }) => listInfo,
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
  let listInfo!: ListInfo;

  const result = await resolveOffsetConnection(
    options,
    async ({ limit, offset }) => {
      const pageSize = limit - 1;
      const { totalCount, items } = await resolve({ limit, offset });

      const lastPage = Math.max(Math.ceil(totalCount / pageSize), 0);

      listInfo = {
        totalCount,
        pageCount: lastPage,
      };
      return items;
    }
  );

  return { ...result, listInfo };
}
