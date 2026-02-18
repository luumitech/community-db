'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import { Modal, ModalBody, ModalContent, ModalHeader } from '~/view/base/modal';
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
      scrollBehavior="outside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>{appLabel('preference')}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 items-center gap-4">
            <div>Theme</div>
            <SelectTheme />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
