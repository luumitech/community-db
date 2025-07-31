'use client';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import { SelectTheme } from './select-theme';

interface Params {}

interface RouteArgs {
  params: Promise<Params>;
}

export default function Preference(props: RouteArgs) {
  const router = useRouter();
  return (
    <Modal
      size="xl"
      placement="top-center"
      scrollBehavior="outside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>{appLabel('preference')}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>Theme</div>
            <SelectTheme />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
