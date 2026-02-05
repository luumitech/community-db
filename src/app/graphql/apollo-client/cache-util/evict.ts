import { type ApolloCache } from '@apollo/client';

export function evictCache(
  cache: ApolloCache<object>,
  typename: string,
  id: string | undefined
) {
  if (id) {
    const normalizedId = cache.identify({ id, __typename: typename });
    cache.evict({ id: normalizedId });
    cache.gc();
  }
}

/**
 * Helper utility for evicting the propertyList cache whenever a change is made
 * to any of the property details that could potentially affect the search
 * results in propertyList
 */
export function evictPropertyListCache(
  cache: ApolloCache<object>,
  communityId: string
) {
  cache.modify({
    id: cache.identify({
      __typename: 'Community',
      id: communityId,
    }),
    fields: {
      propertyList(existing, { DELETE }) {
        return DELETE;
      },
    },
  });
}
