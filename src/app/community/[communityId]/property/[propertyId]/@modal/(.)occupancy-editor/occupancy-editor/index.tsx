import { cn } from '@heroui/react';
import React from 'react';
import { Step0, Step1, Wizard } from './wizard';

interface Props {
  className?: string;
}

export const OccupancyEditor: React.FC<Props> = ({ className }) => {
  return (
    <Wizard>
      <Wizard.Step name="editor">
        <Step0 />
      </Wizard.Step>
      <Wizard.Step name="manager">
        <Step1 />
      </Wizard.Step>
    </Wizard>
  );
};
