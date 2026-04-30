import { cn } from '@heroui/react';
import React from 'react';
import { Modal } from '~/view/base/modal';
import { HouseholdManager } from '../household-manager';

export interface Step1Props {}

export const Step1: React.FC<Step1Props> = (props) => {
  return (
    <Modal.Body className={cn('flex flex-col')}>
      <HouseholdManager />
    </Modal.Body>
  );
};
