import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { Button } from '~/view/base/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { useHookForm } from './use-hook-form';

export interface ModalArg {}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onDelete: () => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({ disclosure, onDelete }) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();
  const { property } = useHookForm();

  const onSubmit = React.useCallback(
    async () =>
      startTransition(async () => {
        try {
          await onDelete();
          onClose();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onDelete, onClose]
  );

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader>Delete Property</ModalHeader>
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
