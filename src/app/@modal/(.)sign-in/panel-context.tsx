import React from 'react';

/** Available screen types */
type PanelT = 'sign-in' | 'verify-email-otp';

type ContextT = Readonly<{
  /** Screen currently on display */
  panel: PanelT;
  /** Go to a specific panel */
  goToPanel: (panel: PanelT) => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function PanelContextProvider(props: Props) {
  const [panel, goToPanel] = React.useState<PanelT>('sign-in');

  return (
    <Context.Provider
      value={{
        panel,
        goToPanel,
      }}
      {...props}
    />
  );
}

export function usePanelContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      `usePanelContext must be used within a PanelContextProvider`
    );
  }
  return context;
}
