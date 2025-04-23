import React from 'react';

/** Available screen types */
type PanelT = 'sign-in' | 'verify-email-otp';
/** Arguments that can be passed to each panel type */
export interface PanelProps {
  ['sign-in']: Record<string, never>;
  ['verify-email-otp']: {
    email: string;
  };
}

type GoToPanel = <P extends PanelT>(panel: P, args: PanelProps[P]) => void;

type ContextT = Readonly<{
  /** Screen currently on display */
  panel: PanelT;
  panelArg?: PanelProps[PanelT];
  /** Go to a specific panel */
  goToPanel: GoToPanel;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function PanelContextProvider(props: Props) {
  const [panel, setPanel] = React.useState<PanelT>('sign-in');
  const [panelArg, setPanelArg] = React.useState<PanelProps[PanelT]>();

  const goToPanel: GoToPanel = React.useCallback((panelName, args) => {
    setPanel(panelName);
    setPanelArg(args);
  }, []);

  return (
    <Context.Provider
      value={{
        panel,
        panelArg,
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
