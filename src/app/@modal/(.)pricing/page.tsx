'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import { PanelWrapper } from './panel-wrapper';
import { PlanContextProvider } from './plan-context';

export default function Pricing() {
  const router = useRouter();

  return (
    <Modal
      size="xl"
      scrollBehavior="outside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable={false}
      // isKeyboardDismissDisabled
    >
      <ModalContent className="overflow-hidden">
        <ModalHeader>{appLabel('pricing')}</ModalHeader>
        <ModalBody>
          <PlanContextProvider>
            <PanelWrapper />
          </PlanContextProvider>
        </ModalBody>
        <ModalFooter className="justify-center" />
      </ModalContent>
    </Modal>
  );
}
