import { Chip, cn } from '@heroui/react';
import React from 'react';
import { useWizard } from 'react-use-wizard';

interface Props {
  stepNo: number;
  stepName: string;
}

export const StepItem: React.FC<Props> = ({ stepNo, stepName }) => {
  const { activeStep } = useWizard();
  const isActive = activeStep === stepNo;

  return (
    <div
      className={cn(
        'flex items-center gap-2 py-1',
        isActive ? 'text-primary' : 'text-foreground-300'
      )}
    >
      <Chip
        size="sm"
        color={isActive ? 'primary' : 'default'}
        isDisabled={!isActive}
      >
        {stepNo + 1}
      </Chip>
      {stepName}
    </div>
  );
};
