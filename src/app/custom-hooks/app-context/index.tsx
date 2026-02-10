import React from 'react';
import { useMedia } from 'react-use';
import { type NextPublicEnvSchema } from '~/lib/env/env-schema';
import {
  useConfirmationModalContext,
  type ConfirmationState,
} from './confirmation-modal';
import { useLoadingModalContext, type LoadingState } from './loading-modal';

interface ContextT extends Readonly<ConfirmationState>, Readonly<LoadingState> {
  env: NextPublicEnvSchema;
  isSmDevice: boolean;
  isMdDevice: boolean;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  env: NextPublicEnvSchema;
  children: React.ReactNode;
}

export function AppProvider({ env, ...props }: Props) {
  const loadingValues = useLoadingModalContext();
  const confirmValues = useConfirmationModalContext();
  const isSmDevice = useMedia('(max-width: 640px)', true);
  const isMdDevice = useMedia('(max-width: 768px)', true);

  return (
    <Context.Provider
      value={{
        env,
        ...confirmValues,
        ...loadingValues,
        isSmDevice,
        isMdDevice,
      }}
      {...props}
    />
  );
}

export function useAppContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useAppContext must be used within a AppContextProvider`);
  }
  return context;
}
