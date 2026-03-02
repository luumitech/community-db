import { ModalBody, cn } from '@heroui/react';
import React from 'react';
import { HouseholdManager } from '../household-manager';

export interface Step1Props {}

export const Step1: React.FC<Step1Props> = (props) => {
  return (
    <ModalBody className={cn('flex flex-col')}>
      <HouseholdManager />
    </ModalBody>
  );
};
