import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';

interface Props {}

export const ErrorDialog: React.FC<Props> = (props) => {
  const router = useRouter();

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Modal
      isOpen
      onOpenChange={goBack}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader>{appLabel('registerEvent')}</ModalHeader>
            <ModalBody>Error: Event Name missing</ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={closeModal}>
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
