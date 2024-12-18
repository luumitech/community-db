import React from 'react';
import type { SubscriptionPlan } from './_type';
import { useSubscriptionPlan } from './use-subscription-plan';

/** Available screen types */
type PanelT =
  // plan select screen
  | 'plan-select'
  // Free plan
  | 'free'
  | 'free-success'
  // Premium plan
  | 'premium'
  | 'premium-success';

type ContextT = Readonly<{
  /** Current subscription plan for context user */
  plan?: SubscriptionPlan;
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

export function PlanContextProvider(props: Props) {
  const plan = useSubscriptionPlan();
  const [panel, goToPanel] = React.useState<PanelT>('plan-select');

  return (
    <Context.Provider
      value={{
        plan,
        panel,
        goToPanel,
      }}
      {...props}
    />
  );
}

export function usePlanContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useAppContext must be used within a PlanContextProvider`);
  }
  return context;
}
