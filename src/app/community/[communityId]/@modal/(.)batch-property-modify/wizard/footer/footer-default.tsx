import React from 'react';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { type WizardContext } from '..';

interface Props {
  context: WizardContext;
  nextDisabled?: boolean;
}

export const FooterDefault: React.FC<Props> = ({ context, nextDisabled }) => {
  const { activeStep, goPrev, goNext } = context;

  return (
    <>
      <Button
        variant="ghost"
        isDisabled={activeStep === 0}
        onPress={goPrev}
        startContent={<Icon className="rotate-180" icon="chevron-forward" />}
      >
        Prev
      </Button>
      <Button
        variant="ghost"
        onPress={goNext}
        isDisabled={nextDisabled}
        endContent={<Icon icon="chevron-forward" />}
      >
        Next
      </Button>
    </>
  );
};
