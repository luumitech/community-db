import React from 'react';
import type { SubscriptionPlan } from './_type';
import { FreePlanConfirmation, FreePlanSuccess } from './free-plan';
import { PremiumPlanConfirmation, PremiumPlanSuccess } from './premium-plan';
import { SelectPlan } from './select-plan';
import { useSubscriptionPlan } from './use-subscription-plan';
import { Wizard } from './wizard';

type ContextT = Readonly<{
  /** Current subscription plan for context user */
  plan?: SubscriptionPlan;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {}

export function PlanContextProvider(props: Props) {
  const plan = useSubscriptionPlan();

  return (
    <Context.Provider
      value={{
        plan,
      }}
    >
      <Wizard>
        <Wizard.Step name="selectPlan">
          <SelectPlan />
        </Wizard.Step>
        <Wizard.Step name="free">
          <FreePlanConfirmation />
        </Wizard.Step>
        <Wizard.Step name="freeSuccess">
          <FreePlanSuccess />
        </Wizard.Step>
        <Wizard.Step name="premium">
          <PremiumPlanConfirmation />
        </Wizard.Step>
        <Wizard.Step name="premiumSuccess">
          <PremiumPlanSuccess />
        </Wizard.Step>
      </Wizard>
    </Context.Provider>
  );
}

export function usePlanContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`usePlanContext must be used within a PlanContextProvider`);
  }
  return context;
}
