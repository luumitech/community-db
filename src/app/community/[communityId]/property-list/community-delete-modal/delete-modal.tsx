import React from 'react';
import { Button } from '~/view/base/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { type UseHookFormWithDisclosureResult } from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
  onDelete: () => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({ hookForm, onDelete }) => {
  const { disclosure, community } = hookForm;
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();

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
            <ModalHeader>Delete Community</ModalHeader>
            <ModalBody>
              <div>
                This will delete community &apos;{community.name}&apos; and all
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
                confirmationArg={{ bodyText: 'Are you sure?' }}
                isDisabled={pending}
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
