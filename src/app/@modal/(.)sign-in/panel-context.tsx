import React from 'react';

export type Direction = 'back' | 'forward';

/** Available screen types */
type PanelT = 'sign-in' | 'send-email-otp' | 'verify-email-otp';
/** Arguments that can be passed to each panel type */
export interface PanelProps {
  ['sign-in']: Record<string, never>;
  ['send-email-otp']: Record<string, never>;
  ['verify-email-otp']: {
    email: string;
  };
}

/** Previous panel (for "go back" functionality) */
const previousPanel: Record<PanelT, PanelT | null> = {
  ['sign-in']: null,
  ['send-email-otp']: 'sign-in',
  ['verify-email-otp']: 'send-email-otp',
};

type GoToPanel = <P extends PanelT>(panel: P, args: PanelProps[P]) => void;

type ContextT = Readonly<{
  /** Screen currently on display */
  panel: PanelT;
  panelArg?: PanelProps[PanelT];
  direction: Direction;
  /** Go to a specific panel */
  goToPanel: GoToPanel;
  /** Go back to previous panel */
  goBack: () => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function PanelContextProvider({ ...props }: Props) {
  const [direction, setDirection] = React.useState<Direction>('forward');
  const [panel, setPanel] = React.useState<PanelT>('sign-in');
  const [panelArg, setPanelArg] = React.useState<PanelProps[PanelT]>();

  const goToPanel: GoToPanel = React.useCallback((panelName, args) => {
    setDirection('forward');
    setPanelArg(args);
    setPanel(panelName);
  }, []);

  const goBack = React.useCallback(() => {
    const prev = previousPanel[panel];
    if (prev) {
      setDirection('back');
      setPanelArg({});
      setPanel(prev);
    }
  }, [panel]);

  return (
    <Context.Provider
      value={{
        panel,
        panelArg,
        direction,
        goToPanel,
        goBack,
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
