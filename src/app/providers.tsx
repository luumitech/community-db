'use client';
import { ApolloProvider } from '@apollo/client';
import { HeroUIProvider } from '@heroui/react';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { env } from 'next-runtime-env';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from '~/custom-hooks/app-context';
import apolloClient from '~/graphql/apollo-client';
import { ConfirmationModal } from '~/view/base/confirmation-modal';
import { ReduxProviders } from './redux-providers';
import { TsrProviders } from './tsr';

interface Props {
  sessionProviderProps: Omit<SessionProviderProps, 'children'>;
}

export const Providers: React.FC<React.PropsWithChildren<Props>> = ({
  sessionProviderProps,
  children,
}) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  return (
    <SessionProvider {...sessionProviderProps}>
      <ApolloProvider client={apolloClient}>
        <HeroUIProvider navigate={router.push}>
          <ReCaptchaProvider
            reCaptchaKey={env('NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY')}
          >
            <ReduxProviders>
              <TsrProviders>
                <AppProvider>
                  {children}

                  <ConfirmationModal />
                  <ToastContainer
                    position="bottom-right"
                    theme={resolvedTheme}
                  />
                </AppProvider>
              </TsrProviders>
            </ReduxProviders>
          </ReCaptchaProvider>
        </HeroUIProvider>
      </ApolloProvider>
    </SessionProvider>
  );
};
