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
