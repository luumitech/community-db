import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  HttpLink,
  InMemoryCache,
  Observable,
  Operation,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { print } from 'graphql';
import { Client, ClientOptions, createClient } from 'graphql-sse';
import { typePolicies } from './type-policies';

const cache = new InMemoryCache({
  typePolicies,
});

/**
 * GraphQL over SSE, for handling subscription
 */
class SSELink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        }
      );
    });
  }
}

/**
 * Unified error handling for apollo
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path, extensions }) =>
      console.warn(
        `[GraphQL error]: Message: ${message}, Path: ${path}, Location: %o, extensions: %o`,
        locations,
        extensions
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

const link = SSELink.from([errorLink, httpLink]);

const apolloClient = new ApolloClient({
  link,
  cache,
});

export default apolloClient;
