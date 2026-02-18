'use client';
import { User } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useUserInfo } from '~/custom-hooks/user-info';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { BuiltBy } from '~/view/footer/build-by';
import { DeleteAccount } from './delete-account';
import { UserInfo } from './user-info';

export default function UserProfile() {
  const router = useRouter();
  const { initial, image } = useUserInfo();

  return (
    <Modal
      size="xl"
      scrollBehavior="inside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="items-center gap-2 text-2xl">
              <User
                className="cursor-pointer transition-transform"
                data-testid="signed-in-user-avatar"
                name=""
                isFocusable
                avatarProps={{
                  isBordered: true,
                  className: 'bg-transparent',
                  ...(initial && { name: initial }),
                  ...(!!image && { src: image }),
                }}
              />
              {appLabel('userProfile')}
            </ModalHeader>
            <ModalBody className="gap-4">
              <UserInfo />
              <DeleteAccount />
            </ModalBody>
            <ModalFooter>
              <BuiltBy className="grow" />
              <Button color="primary" onPress={closeModal}>
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
