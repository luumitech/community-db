import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Wizard, type WizardProps } from 'react-use-wizard';

type ContextT = Readonly<{
  previousStepIdx: React.RefObject<number>;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props extends WizardProps {}

export function AnimatedWizardProvider({
  ...props
}: React.PropsWithChildren<Props>) {
  const previousStepIdx = React.useRef(0);

  return (
    <Context.Provider
      value={{
        previousStepIdx,
      }}
    >
      <div className="relative overflow-hidden">
        <Wizard
          wrapper={<AnimatePresence initial={false} mode="wait" />}
          {...props}
        />
      </div>
    </Context.Provider>
  );
}

export function useAnimatedWizardContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      `useAnimatedWizardContext must be used within a AnimatedWizardProvider`
    );
  }
  return context;
}
