import { ApolloClient, InMemoryCache } from '@apollo/client';
import { typePolicies } from './type-policies';

const cache = new InMemoryCache({
  typePolicies,
});

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache,
});

export default apolloClient;
