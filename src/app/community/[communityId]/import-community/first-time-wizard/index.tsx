import React from 'react';
import { Wizard } from 'react-use-wizard';
import { StepMethodMap1 } from './step-method-map1';
import { StepMethodRandom1 } from './step-method-random1';
import { StepMethodXlsx1 } from './step-method-xlsx1';
import { StepMethodXlsx2 } from './step-method-xlsx2';
import { Step0 } from './step0';

interface Props {
  className?: string;
}

export const FirstTimeWizard: React.FC<Props> = ({ className }) => {
  return (
    <Wizard>
      <Step0 />
      <StepMethodRandom1 />
      <StepMethodMap1 />
      <StepMethodXlsx1 />
      <StepMethodXlsx2 />
    </Wizard>
  );
};
