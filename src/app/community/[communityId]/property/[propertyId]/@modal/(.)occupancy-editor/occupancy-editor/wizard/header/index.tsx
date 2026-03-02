import React from 'react';
import { ModalHeader } from '~/view/base/modal';
import { type WizardContext } from '..';
import { Step0Header } from './step0-header';
import { Step1Header } from './step1-header';

interface Props {
  context: WizardContext;
}

export const Header: React.FC<Props> = ({ context }) => {
  const { activeStep } = context;

  const header = React.useMemo(() => {
    switch (activeStep) {
      case 0:
        return <Step0Header context={context} />;

      case 1:
        return <Step1Header context={context} />;

      default:
        throw new Error(`Unhandled step ${activeStep}`);
    }
  }, [activeStep, context]);

  return <ModalHeader>{header}</ModalHeader>;
};
