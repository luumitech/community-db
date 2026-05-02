import { BreadcrumbItem, Breadcrumbs, Divider } from '@heroui/react';
import React from 'react';
import { Modal } from '~/view/base/modal';
import { type WizardContext } from '..';
import { StepItem } from './step-item';

interface Props {
  context: WizardContext;
}

export const Header: React.FC<Props> = ({ context }) => {
  const steps = [
    'Choose Type of Modification',
    'Select Filter',
    'Provide Details',
  ];

  return (
    <Modal.Body>
      <Breadcrumbs
        // Disables navigation
        isDisabled
      >
        {steps.map((stepName, stepNo) => (
          <BreadcrumbItem
            key={stepNo}
            classNames={{
              // Revert isDisabled styling
              item: 'opacity-100',
            }}
          >
            <StepItem stepNo={stepNo} stepName={stepName} />
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      <Divider />
    </Modal.Body>
  );
};
