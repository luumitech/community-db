import { createYoga } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createContext } from '~/graphql/context';
import { schema } from '~/graphql/schema';

const yoga = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  graphqlEndpoint: '/api/graphql',
  schema,
  context: createContext,
  fetchAPI: {
    Response: Response,
    Request: Request,
  },
  /**
   * See https://the-guild.dev/graphql/yoga-server/docs/features/error-masking
   */
  maskedErrors: false,
});

const { handleRequest } = yoga;

export { handleRequest as GET, handleRequest as POST };
