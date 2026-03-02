import React from 'react';
import { ModalFooter } from '~/view/base/modal';
import { type WizardContext } from '..';
import { Step0Footer } from './step0-footer';
import { Step1Footer } from './step1-footer';

interface Props {
  context: WizardContext;
}

export const Footer: React.FC<Props> = ({ context }) => {
  const { activeStep } = context;

  const header = React.useMemo(() => {
    switch (activeStep) {
      case 0:
        return <Step0Footer context={context} />;

      case 1:
        return <Step1Footer context={context} />;

      default:
        throw new Error(`Unhandled step ${activeStep}`);
    }
  }, [activeStep, context]);

  return <ModalFooter>{header}</ModalFooter>;
};
