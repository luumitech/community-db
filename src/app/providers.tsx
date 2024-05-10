'use client';
import { ApolloProvider } from '@apollo/client';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import apolloClient from '~/graphql/apollo-client';
import { ReduxProviders } from './redux-providers';

interface Props {
  sessionProviderProps: Omit<SessionProviderProps, 'children'>;
}

export const Providers: React.FC<React.PropsWithChildren<Props>> = ({
  sessionProviderProps,
  children,
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <SessionProvider {...sessionProviderProps}>
      <ApolloProvider client={apolloClient}>
        <NextUIProvider>
          <ReduxProviders>
            {children}
            <ToastContainer position="bottom-right" theme={resolvedTheme} />
          </ReduxProviders>
        </NextUIProvider>
      </ApolloProvider>
    </SessionProvider>
  );
};
