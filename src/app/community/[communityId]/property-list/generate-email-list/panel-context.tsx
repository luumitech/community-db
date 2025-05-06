import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import type { PropertyEntry } from './_type';

/** Available screen types */
type PanelT = 'filter-select' | 'email-list';
/** Arguments that can be passed to each panel type */
export interface PanelProps {
  ['filter-select']: Record<string, never>;
  ['email-list']: {
    propertyList: PropertyEntry[];
  };
}

type GoToPanel = <P extends PanelT>(panel: P, args: PanelProps[P]) => void;

type ContextT = Readonly<{
  disclosure: UseDisclosureReturn;
  /** Screen currently on display */
  panel: PanelT;
  panelArg?: PanelProps[PanelT];
  /** Go to a specific panel */
  goToPanel: GoToPanel;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  disclosure: UseDisclosureReturn;
  children: React.ReactNode;
}

export function PanelContextProvider({ disclosure, ...props }: Props) {
  const [panel, setPanel] = React.useState<PanelT>('filter-select');
  const [panelArg, setPanelArg] = React.useState<PanelProps[PanelT]>();

  const goToPanel: GoToPanel = React.useCallback((panelName, args) => {
    setPanel(panelName);
    setPanelArg(args);
  }, []);

  return (
    <Context.Provider
      value={{
        disclosure,
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
