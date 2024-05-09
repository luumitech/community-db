'use client';
import { ApolloProvider } from '@apollo/client';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import React from 'react';
import apolloClient from '~/graphql/apollo-client';

interface Props {
  sessionProviderProps: Omit<SessionProviderProps, 'children'>;
}

export const Providers: React.FC<React.PropsWithChildren<Props>> = ({
  sessionProviderProps,
  children,
}) => {
  return (
    <SessionProvider {...sessionProviderProps}>
      <ApolloProvider client={apolloClient}>
        <NextUIProvider>{children}</NextUIProvider>
      </ApolloProvider>
    </SessionProvider>
  );
};
