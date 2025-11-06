'use client';
import { Modal, ModalContent } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
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
    >
      <ModalContent className="overflow-x-hidden">
        <div className="m-auto mt-6">
          <AppLogo size={64} onClick={() => router.push(appPath('home'))} />
        </div>
        <PanelContextProvider>
          <PanelWrapper />
        </PanelContextProvider>
      </ModalContent>
    </Modal>
  );
}
