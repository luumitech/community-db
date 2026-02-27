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

export function createAnimatedWizard<
  Steps extends { [K in keyof Steps]: object },
>() {
  type StepNames = keyof Steps;

  interface WizardContext {
    activeStep: number;

    /**
     * Go to an arbitrary step by step name
     *
     * @param step Named step
     * @param arg Properties to be passed to the step
     */
    goTo<K extends StepNames>(step: K, arg: Steps[K]): void;
    /**
     * Go to an arbitrary step by index
     *
     * @param step Step index (0-based)
     */
    goTo(step: number): void;

    goNext(): void;
    goPrev(): void;
    goBack(): void;
  }

  const Context = React.createContext<WizardContext | undefined>(undefined);

  function Step<Name extends StepNames>({
    name,
    children,
    ...props
  }: React.PropsWithChildren<{ name: Name }>) {
    // children can be a React element, clone it with props
    if (React.isValidElement(children)) {
      return React.cloneElement(children, props);
    }
    return children;
  }

  function Wizard({ children }: React.PropsWithChildren) {
    const steps = React.Children.toArray(children).filter(
      React.isValidElement
    ) as React.ReactElement<{ name: StepNames } & object>[];

    const stepNames = steps.map((s) => s.props.name);

    const [activeStep, setActiveStep] = React.useState(0);
    const [direction, setDirection] = React.useState(1);
    const [stepArg, setStepArg] = React.useState<unknown>();
    const prevStep = usePreviousDistinct(activeStep);
    const prevArg = usePreviousDistinct(stepArg);

    const stepCount = steps.length;

    const goTo = React.useCallback<WizardContext['goTo']>(
      (step: string | number, arg?: unknown) => {
        let stepIndex: number;
        switch (typeof step) {
          case 'number':
            stepIndex = step;
            break;

          case 'string':
            const idx = stepNames.indexOf(step as StepNames);
            if (idx === -1) {
              throw new Error(`Step "${step}" not found`);
            }
            stepIndex = idx;
            break;

          default:
            throw new Error(`step must be number or string`);
        }

        if (stepIndex < 0 || stepIndex >= stepCount) {
          throw new Error(`Step index ${stepIndex} out of bounds`);
        }

        setDirection(stepIndex - activeStep);
        setActiveStep(stepIndex);
        setStepArg(arg);
      },
      [activeStep, stepNames, stepCount]
    );

    const goNext = React.useCallback(() => {
      if (activeStep < stepCount - 1) {
        setDirection(1);
        setActiveStep((s) => s + 1);
      }
    }, [activeStep, stepCount]);

    const goPrev = React.useCallback(() => {
      if (activeStep > 0) {
        setDirection(-1);
        setActiveStep((s) => s - 1);
      }
    }, [activeStep]);

    const goBack = React.useCallback(() => {
      if (prevStep != null) {
        setDirection(-1);
        setActiveStep(prevStep);
        setStepArg(prevArg);
      }
    }, [prevStep, prevArg]);

    return (
      <Context.Provider value={{ activeStep, goTo, goNext, goPrev, goBack }}>
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeStep}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', duration: 0.5 }}
            >
              {React.cloneElement(
                steps[activeStep],
                stepArg as Steps[StepNames]
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Context.Provider>
    );
  }

  function useWizard() {
    const ctx = React.useContext(Context);
    if (!ctx) {
      throw new Error('useWizard must be used inside Wizard');
    }
    return ctx;
  }

  Wizard.Step = Step;
  Wizard.useWizard = useWizard;

  return Wizard;
}
