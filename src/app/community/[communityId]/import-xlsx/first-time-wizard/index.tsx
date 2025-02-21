import { cn } from '@heroui/react';
import React from 'react';
import { Wizard } from 'react-use-wizard';
import { Step0 } from './step0';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3 } from './step3';

interface Props {
  className?: string;
}

export const FirstTimeWizard: React.FC<Props> = ({ className }) => {
  return (
    <Wizard>
      <Step0 />
      <Step1 />
      <Step2 />
      <Step3 />
    </Wizard>
  );
};
