import React from 'react';
import { useWizard } from 'react-use-wizard';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';

interface Props {
  nextDisabled?: boolean;
}

export const FooterDefault: React.FC<Props> = ({ nextDisabled }) => {
  const { activeStep, isLastStep, previousStep, nextStep, goToStep } =
    useWizard();

  return (
    <>
      <Button
        variant="ghost"
        isDisabled={activeStep === 0}
        onPress={previousStep}
        startContent={<Icon className="rotate-180" icon="chevron-forward" />}
      >
        Prev
      </Button>
      <Button
        variant="ghost"
        onPress={nextStep}
        isDisabled={nextDisabled}
        endContent={<Icon icon="chevron-forward" />}
      >
        Next
      </Button>
    </>
  );
};
