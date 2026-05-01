import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
  type ModalProps as NextUIModalProps,
} from '@heroui/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { type ConfirmationModalArg } from '~/view/base/confirmation-modal';

type Modal = typeof ModalImpl & {
  Content: typeof ModalContent;
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

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
   * dialog should open. This is useful if you want to run a validation first
   * before showing the confirmation dialog. (By default, validation is run when
   * you submit)
   *
   * - If the callback returns true, the confirmation dialog will open
   * - If the callback returns false, the confirmation dialog will not open
   * - If the callback is not provided, the confirmation dialog will open
   */
  beforeConfirm?: () => Promise<boolean>;
}

const ModalImpl = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      confirmation,
      confirmationArg,
      beforeConfirm,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname();
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    const customOnOpenChange = React.useCallback<
      (modalIsOpen: boolean) => void
    >(
      async (modalIsOpen) => {
        if (!confirmation) {
          onOpenChange?.(modalIsOpen);
          return;
        }
        const showDialog = (await beforeConfirm?.()) ?? true;
        if (showDialog) {
          open({
            ...confirmationArg,
            onConfirm: () => {
              confirmationArg?.onConfirm?.();
              onOpenChange?.(modalIsOpen);
            },
          });
        }
      },
      [beforeConfirm, confirmation, confirmationArg, onOpenChange, open]
    );

    return (
      <NextUIModal
        // This ensure the modal is remounted whenever the route changes
        key={pathname}
        onOpenChange={customOnOpenChange}
        {...props}
      />
    );
  }
);
ModalImpl.displayName = 'Modal';

export const Modal = ModalImpl as Modal;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
