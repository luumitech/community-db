import { cn } from '@heroui/react';
import React from 'react';
import { AnimatedWizardProvider } from '~/view/base/animated-wizard';
import { Step0, Step1, STEP_KEYS } from './wizard';

interface Props {
  className?: string;
}

export const OccupancyEditor: React.FC<Props> = ({ className }) => {
  return (
    <AnimatedWizardProvider stepKeys={STEP_KEYS}>
      <Step0 />
      <Step1 />
    </AnimatedWizardProvider>
  );
};
