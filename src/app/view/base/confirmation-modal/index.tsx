import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props {}

/**
 * A confirmation modal that is supposed to be installed in the AppContext and
 * controlled by its helper hook useConfirmationModal
 */
export const ConfirmationModal: React.FC<Props> = () => {
  const { confirmationModal } = useAppContext();
  const { disclosure, modalArg } = confirmationModal;
  const { modalProps, content, body, onConfirm, onCancel } = modalArg ?? {};

  return (
    <Modal
      classNames={{
        base: 'border-warning border-[2px]',
      }}
      size="xs"
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton
      {...modalProps}
    >
      <ModalContent>
        {(closeModal) =>
          content ? (
            content({ closeModal, onConfirm, onCancel })
          ) : (
            <>
              <ModalBody>{body ?? 'Discard Changes?'}</ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={(evt) => {
                    onCancel?.();
                    closeModal();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={(evt) => {
                    onConfirm?.();
                    closeModal();
                  }}
                >
                  OK
                </Button>
              </ModalFooter>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
};
