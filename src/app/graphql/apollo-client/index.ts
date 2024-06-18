import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  HttpLink,
  InMemoryCache,
  Observable,
  Operation,
  from,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
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
const errorLink = onError((response) => {
  const { graphQLErrors, networkError, operation } = response;
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
    console.warn(networkError);
  }
  console.warn('operation: %o', operation);
});

// Non-subscription enabled link
// const httpLink = new HttpLink({
const httpLink = createUploadLink({
  uri: '/api/graphql',
});

// Subscription enabled link
const sseLink = new SSELink({
  url: '/api/graphql',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  sseLink,
  from([errorLink, httpLink])
);

const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
});

export default apolloClient;
