'use client';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { FreePlanConfirmation, FreePlanSuccess } from './free-plan';
import { usePlanContext } from './plan-context';
import { PremiumPlanConfirmation, PremiumPlanSuccess } from './premium-plan';
import { SelectPlan } from './select-plan';

type Direction = 'back' | 'forward';

const variants = {
  initial: (direction: Direction) => ({
    x: direction === 'forward' ? '130%' : '-130%',
  }),
  animate: {
    x: '0',
  },
  exit: (direction: Direction) => ({
    x: direction === 'forward' ? '-130%' : '130%',
  }),
};

interface Props {
  className?: string;
}

export const PanelWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  const { plan, panel } = usePlanContext();
  const direction = panel === 'plan-select' ? 'backward' : 'forward';

  return (
    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
      <motion.div
        key={panel}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'tween', duration: 0.5 }}
        variants={variants}
        custom={direction}
      >
        {panel === 'plan-select' && <SelectPlan />}
        {panel === 'free' && <FreePlanConfirmation />}
        {panel === 'free-success' && <FreePlanSuccess />}
        {panel === 'premium' && <PremiumPlanConfirmation />}
        {panel === 'premium-success' && <PremiumPlanSuccess />}
      </motion.div>
    </AnimatePresence>
  );
};
