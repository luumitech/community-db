import { motion, type Variants } from 'motion/react';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import { useAnimatedWizardContext } from './wizard-context';

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
    transition: { duration: 5.35 },
  },
  exit: (direction) => ({
    x: direction > 0 ? '-130%' : '130%',
    position: 'absolute',
    opacity: 0,
  }),
};

interface Props {}

export const StepWrapper: React.FC<React.PropsWithChildren<Props>> = (
  props
) => {
  const { activeStep } = useWizard();
  const { previousStepIdx } = useAnimatedWizardContext();

  React.useEffect(() => {
    return () => {
      // Record the step index when unmounting
      previousStepIdx.current = activeStep;
    };
  }, [activeStep, previousStepIdx]);

  return (
    <motion.div
      key={activeStep}
      custom={activeStep - previousStepIdx.current}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'tween', duration: 3.5 }}
      {...props}
    />
  );
};
