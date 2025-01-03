import React from 'react';
import { useCommunityContext, type CommunityState } from './community';
import {
  useConfirmationModalContext,
  type ConfirmationState,
} from './confirmation-modal';

interface ContextT extends Readonly<ConfirmationState & CommunityState> {}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function AppProvider(props: Props) {
  const confirmValues = useConfirmationModalContext();
  const communityValues = useCommunityContext();

  return (
    <Context.Provider
      value={{
        ...confirmValues,
        ...communityValues,
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
