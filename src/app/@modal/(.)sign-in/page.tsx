'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSignIn } from '~/custom-hooks/auth';
import { AppLogo } from '~/view/app-logo';
import { Icon } from '~/view/base/icon';

export default function SignIn() {
  const router = useRouter();
  const { signInGoogle } = useSignIn();

  return (
    <Modal
      size="sm"
      isOpen
      onOpenChange={() => router.back()}
      isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader className="text-left text-3xl font-semibold gap-2">
          <AppLogo /> Sign In
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            <Button
              startContent={<Icon icon="google" size={24} />}
              variant="bordered"
              onPress={signInGoogle}
            >
              Continue with Google
            </Button>
          </div>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
