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
import { FreePlan } from './free-plan';
import { PremiumPlan } from './premium-plan';
import styles from './styles.module.css';

export default function Pricing() {
  const router = useRouter();
  return (
    <Modal
      size="xl"
      scrollBehavior="outside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>{appLabel('pricing')}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4 items-start p-2">
            <FreePlan className={styles['item-with-border']} />
            <PremiumPlan />
          </div>
        </ModalBody>
        <ModalFooter className="justify-center">
          Need more capabilities? Contact our team
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
