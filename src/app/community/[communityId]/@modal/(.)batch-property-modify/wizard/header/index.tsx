import { BreadcrumbItem, Breadcrumbs, Divider } from '@heroui/react';
import React from 'react';
import { ModalBody } from '~/view/base/modal';
import { StepItem } from './step-item';

interface Props {}

export const Header: React.FC<Props> = ({}) => {
  const steps = [
    'Choose Type of Modification',
    'Select Filter',
    'Provide Details',
  ];

  return (
    <ModalBody>
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
    </ModalBody>
  );
};
