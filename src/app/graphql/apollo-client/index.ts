import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { typePolicies } from './type-policies';

const cache = new InMemoryCache({
  typePolicies,
});

/**
 * Unified error handling for apollo
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.warn(
        `[GraphQL error]: Message: ${message}, Path: ${path}, Location: %o`,
        locations
      )
    );
  }
  if (networkError) {
    console.warn(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: '/api/graphql',
});

const link = ApolloLink.from([errorLink, httpLink]);

const apolloClient = new ApolloClient({
  link,
  cache,
});

export default apolloClient;
