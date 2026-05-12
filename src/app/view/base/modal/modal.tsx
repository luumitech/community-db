import { usePathname } from 'next/navigation';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { type ConfirmationModalArg } from '~/view/base/confirmation-modal';
import { PlainModal, type PlainModalProps } from './plain-modal';

export interface ModalProps extends PlainModalProps {
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

const ModalImpl: React.FC<ModalProps> = ({
  confirmation,
  confirmationArg,
  beforeConfirm,
  onOpenChange,
  ...props
}) => {
  const pathname = usePathname();
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
    <PlainModal
      // This ensure the modal is remounted whenever the route changes
      key={pathname}
      onOpenChange={customOnOpenChange}
      {...props}
    />
  );
};

ModalImpl.displayName = 'Modal';

type ModalImpl = typeof ModalImpl & {
  Content: typeof PlainModal.Content;
  Header: typeof PlainModal.Header;
  Body: typeof PlainModal.Body;
  Footer: typeof PlainModal.Footer;
};

export const Modal = ModalImpl as ModalImpl;
Modal.Content = PlainModal.Content;
Modal.Header = PlainModal.Header;
Modal.Body = PlainModal.Body;
Modal.Footer = PlainModal.Footer;
