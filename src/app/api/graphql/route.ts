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
});

export { yoga as GET, yoga as POST };
