'use client';
import { Modal, ModalContent } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AppLogo } from '~/view/app-logo';
import { PanelContextProvider } from './panel-context';
import { PanelWrapper } from './panel-wrapper';

export default function SignIn() {
  const router = useRouter();

  return (
    <Modal
      size="sm"
      placement="top-center"
      isOpen
      onOpenChange={() => router.back()}
      isKeyboardDismissDisabled
      isDismissable={false}
      hideCloseButton
    >
      <ModalContent>
        <div className="m-auto mt-6">
          <AppLogo size={64} />
        </div>
        <PanelContextProvider>
          <PanelWrapper />
        </PanelContextProvider>
      </ModalContent>
    </Modal>
  );
}
