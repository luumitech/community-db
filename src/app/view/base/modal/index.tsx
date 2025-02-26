import {
  Modal as NextUIModal,
  ModalProps as NextUIModalProps,
} from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { ConfirmationModalArg } from '~/view/base/confirmation-modal/helper';

export {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';

export interface ModalProps extends NextUIModalProps {
  /**
   * Pop up a modal dialog to serve as additional confirmation before calling
   * the onPress action
   */
  confirmation?: boolean;
  confirmationArg?: ConfirmationModalArg;
  /**
   * This option is only available when `confirmation` is true.
   *
   * When provided, this function is called to decide whether confirmation
   * dialog should open:
   *
   * - If the callback returns true, the confirmation dialog will open
   * - If the callback returns false, the confirmation dialog will not open
   * - If the callback is not provided, the confirmation dialog will open
   */
  beforeConfirm?: () => Promise<boolean>;
}

export const Modal: React.FC<ModalProps> = ({
  className,
  confirmation,
  confirmationArg,
  beforeConfirm,
  onOpenChange,
  ...props
}) => {
  const { confirmationModal } = useAppContext();
  const { open } = confirmationModal;

  const customOnOpenChange = React.useCallback<(modalIsOpen: boolean) => void>(
    async (modalIsOpen) => {
      if (!confirmation) {
        onOpenChange?.(modalIsOpen);
        return;
      }
      const showDialog = (await beforeConfirm?.()) ?? true;
      if (showDialog) {
        open({
          ...confirmationArg,
          onConfirm: async () => {
            onOpenChange?.(modalIsOpen);
          },
        });
      }
    },
    [beforeConfirm, confirmation, confirmationArg, onOpenChange, open]
  );

  return <NextUIModal onOpenChange={customOnOpenChange} {...props} />;
};
