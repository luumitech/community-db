import { cn } from '@heroui/react';
import React from 'react';
import {
  AnimatedWizardProvider,
  StepWrapper,
} from '~/view/base/animated-wizard';
import { Step0, Step1 } from './wizard';

interface Props {
  className?: string;
}

export const OccupancyEditor: React.FC<Props> = ({ className }) => {
  return (
    <AnimatedWizardProvider>
      <StepWrapper>
        <Step0 />
      </StepWrapper>
      <StepWrapper>
        <Step1 />
      </StepWrapper>
    </AnimatedWizardProvider>
  );
};
