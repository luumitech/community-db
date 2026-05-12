'use client';
import { Avatar } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useUserInfo } from '~/custom-hooks/user-info';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Modal } from '~/view/base/modal';
import { BuiltBy } from '~/view/footer/build-by';
import { DeleteAccount } from './delete-account';
import { UserInfo } from './user-info';

export default function UserProfile() {
  const router = useRouter();
  const { fullName, image } = useUserInfo();

  return (
    <Modal
      size="lg"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <Modal.Content>
        {({ close }) => (
          <>
            <Modal.Header className="flex flex-row items-center gap-2 text-2xl">
              <Avatar
                className="bg-transparent"
                data-testid="signed-in-user-avatar"
                isFocusable
                isBordered
                {...(fullName != null && { name: fullName })}
                {...(image != null && { src: image })}
              />
              {appLabel('userProfile')}
            </Modal.Header>
            <Modal.Body className="gap-4">
              <UserInfo />
              <DeleteAccount />
            </Modal.Body>
            <Modal.Footer>
              <BuiltBy className="grow" />
              <Button color="primary" onPress={close}>
                OK
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
}
