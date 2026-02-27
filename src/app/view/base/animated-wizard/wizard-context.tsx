import { AnimatePresence, motion, type Variants } from 'motion/react';
import React from 'react';
import { usePreviousDistinct } from 'react-use';

/**
 * Animation configuration
 *
 * Slide left or right depending on the direction given
 */
const variants: Variants = {
  initial: (direction) => ({
    x: direction > 0 ? '130%' : '-130%',
    position: 'absolute',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: 'relative',
  },
  exit: (direction) => ({
    x: direction > 0 ? '-130%' : '130%',
    position: 'absolute',
    opacity: 0,
  }),
};

type StepArgs = Record<string, unknown>;

/**
 * @param step Step index or step key name
 * @param arg Props to be pass when rendering the step
 */
type GoToFn<K extends readonly string[]> = (
  step: number | K[number],
  arg?: StepArgs
) => void;

type ContextT<K extends readonly string[]> = Readonly<{
  /** Current step index (0-based) */
  activeStep: number;
  /** Go to arbitrary step (by step index or name) */
  goTo: GoToFn<K>;
  /** Go back to the step you were last in */
  goBack: () => void;
  /** Go to the next sequential step */
  goNext: () => void;
  /** Go to the previous sequential step */
  goPrev: () => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props<K extends readonly string[]> {
  stepKeys?: K;
}

export function AnimatedWizardProvider<K extends readonly string[]>({
  children,
  stepKeys,
}: React.PropsWithChildren<Props<K>>) {
  const [activeStep, setActiveStep] = React.useState(0);
  const prevStep = usePreviousDistinct(activeStep);
  const [direction, setDirection] = React.useState(1);
  const [stepArg, setStepArg] = React.useState<StepArgs>();
  const prevArg = usePreviousDistinct(stepArg);

  const stepCount = React.Children.count(children);

  const goNext = React.useCallback(() => {
    setDirection(1);
    setActiveStep((step) => Math.min(step + 1, stepCount - 1));
  }, [stepCount]);

  const goPrev = React.useCallback(() => {
    setDirection(-1);
    setActiveStep((step) => Math.max(step - 1, 0));
  }, []);

  const goBack = React.useCallback(() => {
    if (prevStep != null) {
      setDirection(-1);
      setActiveStep(prevStep);
      setStepArg(prevArg);
    }
  }, [prevArg, prevStep]);

  const goTo = React.useCallback<GoToFn<K>>(
    (_step, arg) => {
      let step: number;
      if (typeof _step === 'string') {
        const stepIdx = stepKeys?.findIndex((stepName) => stepName === _step);
        if (stepIdx == null || stepIdx === -1) {
          throw new Error('step name provided not found in "stepKeys"');
        }
        step = stepIdx;
      } else {
        step = _step;
      }
      if (step < 0 || step >= stepCount) {
        throw new Error(`step ${step} is out of bound`);
      }
      setDirection(step - activeStep);
      setActiveStep(step);
      setStepArg(arg);
    },
    [activeStep, stepKeys, stepCount]
  );

  const childrenWithArg = React.useMemo(
    () =>
      React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        return React.cloneElement(child, stepArg);
      }),
    [children, stepArg]
  );

  return (
    <Context.Provider
      value={{
        activeStep,
        goTo,
        goBack,
        goNext,
        goPrev,
      }}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeStep}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', duration: 2 }}
          >
            {childrenWithArg?.[activeStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    </Context.Provider>
  );
}

export function useAnimatedWizardContext<K extends readonly string[]>() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      `useAnimatedWizardContext must be used within a AnimatedWizardProvider`
    );
  }
  return context as ContextT<K>;
}
