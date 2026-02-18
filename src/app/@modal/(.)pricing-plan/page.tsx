'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { PanelWrapper } from './panel-wrapper';
import { PlanContextProvider } from './plan-context';

export default function PricingPlan() {
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
        <ModalHeader>{appLabel('pricingPlan')}</ModalHeader>
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
