import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createYoga } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createContext } from '~/graphql/context';
import persistedOperations from '~/graphql/generated/persisted-documents.json';
import { schema } from '~/graphql/schema';

/**
 * Allow only persisted graphQL queries
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
const persistedQueryPlugin = usePersistedOperations({
  getPersistedOperation(sha256Hash: string) {
    // @ts-expect-error: imported JSON should have Record type
    return persistedOperations[sha256Hash];
  },
});

const yoga = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  /**
   * GraphiQL is enabled only in development and served under this endpoint
   * See: https://the-guild.dev/graphql/yoga-server/docs/features/graphiql
   */
  graphqlEndpoint: '/api/graphql',
  schema,
  context: createContext,
  fetchAPI: {
    Response: Response,
    Request: Request,
  },
  plugins: [persistedQueryPlugin],
  /**
   * See https://the-guild.dev/graphql/yoga-server/docs/features/error-masking
   */
  // maskedErrors: false,
});

const { handleRequest } = yoga;

export {
  // Required for graphiql to work
  handleRequest as GET,
  handleRequest as OPTIONS,
  handleRequest as POST,
};
