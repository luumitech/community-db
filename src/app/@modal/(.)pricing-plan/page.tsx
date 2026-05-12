'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import { Modal } from '~/view/base/modal';
import { PlanContextProvider } from './plan-context';

export default function PricingPlan() {
  const router = useRouter();

  return (
    <Modal
      size="lg"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable={false}
      // isKeyboardDismissDisabled
    >
      <Modal.Content className="overflow-hidden">
        <Modal.Header>{appLabel('pricingPlan')}</Modal.Header>
        <Modal.Body>
          <PlanContextProvider />
        </Modal.Body>
        <Modal.Footer className="justify-center" />
      </Modal.Content>
    </Modal>
  );
}
