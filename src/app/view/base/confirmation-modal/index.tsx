import { Button } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  type ModalProps,
} from '~/view/base/modal';

interface ContentArg {
  closeModal: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ConfirmationModalArg {
  modalProps?: Omit<ModalProps, 'children'>;

  /**
   * Specify the entire content of the Modal
   *
   * If used, `body` will be ignored
   */
  content?: (arg: ContentArg) => React.ReactNode;

  /**
   * By default, if `content` is not specified, the confirmation modal will be
   * rendered with a default body, with cancel and OK button
   *
   * The body content can be customized
   */
  body?: React.ReactNode;

  /** Callback when OK button in the confirmation dialog is pressed */
  onConfirm?: () => void;
  /** Callback when cancel button in the confirmation dialog is pressed */
  onCancel?: () => void;
}

interface Props {}

/**
 * A confirmation modal that is supposed to be installed in the AppContext and
 * controlled by its helper hook useConfirmationModal
 */
export const ConfirmationModal: React.FC<Props> = () => {
  const { confirmationModal } = useAppContext();
  const { disclosure, arg } = confirmationModal;

  if (arg == null) {
    return null;
  }

  const { modalProps, content, body, onConfirm, onCancel } = arg;

  return (
    <Modal
      classNames={{
        base: 'border-warning border-2',
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
