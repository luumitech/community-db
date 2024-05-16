import React from 'react';
import { useConfirmationModal } from '~/view/base/confirmation-modal/helper';

type State = Readonly<Record<string, unknown>>;

interface ContextT extends State {
  confirmationModal: ReturnType<typeof useConfirmationModal>;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function AppProvider(props: Props) {
  const confirmationModal = useConfirmationModal();

  const value = React.useMemo<ContextT>(
    () => ({ confirmationModal }),
    [confirmationModal]
  );
  return <Context.Provider value={value} {...props} />;
}

export function useAppContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useAppContext must be used within a AppContextProvider`);
  }
  return context;
}
