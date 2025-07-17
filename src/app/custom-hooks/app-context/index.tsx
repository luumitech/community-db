import React from 'react';
import {
  useConfirmationModalContext,
  type ConfirmationState,
} from './confirmation-modal';

interface ContextT extends Readonly<ConfirmationState> {}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function AppProvider(props: Props) {
  const confirmValues = useConfirmationModalContext();

  return (
    <Context.Provider
      value={{
        ...confirmValues,
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
