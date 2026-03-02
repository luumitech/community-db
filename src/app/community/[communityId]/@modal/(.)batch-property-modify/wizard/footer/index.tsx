import React from 'react';
import { ModalFooter } from '~/view/base/modal';
import { type WizardContext } from '../';
import { Step0Footer } from './step0-footer';
import { Step1Footer } from './step1-footer';
import { Step2Footer } from './step2-footer';

interface Props {
  context: WizardContext;
  isSubmitting?: boolean;
  closeModal: () => void;
}

export const Footer: React.FC<Props> = ({ context, ...props }) => {
  const { activeStep } = context;

  const footer = React.useMemo(() => {
    switch (activeStep) {
      case 0:
        return <Step0Footer context={context} />;

      case 1:
        return <Step1Footer context={context} />;

      case 2:
        return <Step2Footer context={context} {...props} />;

      default:
        throw new Error(`Unhandled step ${activeStep}`);
    }
  }, [activeStep, context, props]);

  return <ModalFooter>{footer}</ModalFooter>;
};
