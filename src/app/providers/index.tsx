'use client';
import React from 'react';
import { AppProvider } from '~/custom-hooks/app-context';
import { type NextPublicEnvSchema } from '~/lib/env/env-schema';
import { ConfirmationModal } from '~/view/base/confirmation-modal';
import { ApolloProviders } from './apollo';
import { GoogleRecaptchaProviders } from './google-recaptcha';
import { HeroUIProviders } from './hero-ui';
import { ReduxProviders } from './redux';
import { ThemeProviders } from './theme';
import { ToastifyProviders } from './toastify';
import { TsrProviders } from './tsr';

interface Props {
  env: NextPublicEnvSchema;
}

export const Providers: React.FC<React.PropsWithChildren<Props>> = ({
  env,
  children,
}) => {
  return (
    <TsrProviders>
      <ApolloProviders>
        <ThemeProviders>
          <HeroUIProviders>
            <GoogleRecaptchaProviders
              reCaptchaKey={env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
            >
              <ReduxProviders>
                <AppProvider env={env}>
                  {children}
                  <ConfirmationModal />
                  <ToastifyProviders />
                </AppProvider>
              </ReduxProviders>
            </GoogleRecaptchaProviders>
          </HeroUIProviders>
        </ThemeProviders>
      </ApolloProviders>
    </TsrProviders>
  );
};
