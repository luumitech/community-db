import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createYoga, useErrorHandler } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createContext } from '~/graphql/context';
import persistedOperations from '~/graphql/generated/persisted-documents.json';
import { schema } from '~/graphql/schema';
import { Logger } from '~/lib/logger';

const logger = Logger('graphql/route');

/** Allow only persisted graphQL queries */
// eslint-disable-next-line react-hooks/rules-of-hooks
const persistedQueryPlugin = usePersistedOperations({
  getPersistedOperation(sha256Hash: string) {
    // @ts-expect-error: imported JSON should have Record type
    return persistedOperations[sha256Hash];
  },
});

// eslint-disable-next-line react-hooks/rules-of-hooks
const errorHandlerPlugin = useErrorHandler(({ errors, context, phase }) => {
  errors.forEach((error) => {
    logger.error(error);
  });
});

const yoga = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  /**
   * GraphiQL is enabled only in development and served under this endpoint
   *
   * See: https://the-guild.dev/graphql/yoga-server/docs/features/graphiql
   */
  graphqlEndpoint: '/api/graphql',
  schema,
  context: createContext,
  fetchAPI: {
    Response: Response,
    Request: Request,
  },
  plugins: [errorHandlerPlugin, persistedQueryPlugin],
  /** See https://the-guild.dev/graphql/yoga-server/docs/features/error-masking */
  // maskedErrors: false,
});

const { handleRequest } = yoga;

export {
  // Required for graphiql to work
  handleRequest as GET,
  handleRequest as OPTIONS,
  handleRequest as POST,
};
