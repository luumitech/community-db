import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { makeApolloClient } from '~/graphql/apollo-client';

interface Props {}

const apolloClient = makeApolloClient();

export const ApolloProviders: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
