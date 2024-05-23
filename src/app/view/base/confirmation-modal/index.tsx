import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props {}

/**
 * A confirmation modal that is supposed to be installed
 * in the AppContext and controlled by its helper hook
 * useConfirmationModal
 */
export const ConfirmationModal: React.FC<Props> = () => {
  const { confirmationModal } = useAppContext();
  const { disclosure, bodyText, onConfirm, onCancel } =
    confirmationModal.getModalArgs();

  return (
    <Modal
      size="xs"
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton
      classNames={{
        base: 'border-warning border-[2px]',
      }}
    >
      <ModalContent>
        <ModalBody>
          <p>{bodyText ?? 'Discard Changes?'}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onPress={onCancel}>
            Cancel
          </Button>
          <Button color="primary" onPress={onConfirm}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
