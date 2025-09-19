import { useRouter } from 'next/navigation';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { useHookForm } from './use-hook-form';

interface Props {
  onDelete: (property: GQL.PropertyId_PropertyDeleteFragment) => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({ onDelete }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const { property } = useHookForm();

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = React.useCallback(
    async () =>
      startTransition(async () => {
        try {
          await onDelete(property);
          goBack();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onDelete, goBack, property]
  );

  return (
    <Modal
      size="5xl"
      placement="top-center"
      modalPath="propertyDelete"
      isOpen
      onOpenChange={goBack}
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader>{appLabel('propertyDelete')}</ModalHeader>
            <ModalBody>
              <div>
                This will delete property &apos;{property.address}&apos; and all
                data within it.
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={closeModal}>
                Cancel
              </Button>
              <Button
                color="danger"
                confirmation
                confirmationArg={{ body: 'Are you sure?' }}
                isLoading={pending}
                onPress={onSubmit}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
