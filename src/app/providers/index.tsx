'use client';
import React from 'react';
import { AppProvider } from '~/custom-hooks/app-context';
import { ConfirmationModal } from '~/view/base/confirmation-modal';
import { ApolloProviders } from './apollo';
import { GoogleRecaptchaProviders } from './google-recaptcha';
import { HeroUIProviders } from './hero-ui';
import { ReduxProviders } from './redux';
import { ToastifyProviders } from './toastify';
import { TsrProviders } from './tsr';

interface Props {}

export const Providers: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <TsrProviders>
      <ApolloProviders>
        <HeroUIProviders>
          <GoogleRecaptchaProviders>
            <ReduxProviders>
              <AppProvider>
                {children}
                <ConfirmationModal />
                <ToastifyProviders />
              </AppProvider>
            </ReduxProviders>
          </GoogleRecaptchaProviders>
        </HeroUIProviders>
      </ApolloProviders>
    </TsrProviders>
  );
};
