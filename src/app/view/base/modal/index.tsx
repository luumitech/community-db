import {
  Modal as NextUIModal,
  ModalProps as NextUIModalProps,
} from '@heroui/react';
import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { supportedPathTemplates } from '~/lib/app-path';
import { type ConfirmationModalArg } from '~/view/base/confirmation-modal';

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
  /**
   * If the modal is mounted on a parallel route, specifying the path template
   * name here will enable the modal to show only if the route is actually
   * matching the specified path template name.
   *
   * THis is very useful when you want to forcefully close the modal, simply by
   * navigating to another route
   */
  modalPath?: keyof typeof supportedPathTemplates;
}

export const Modal: React.FC<ModalProps> = ({
  className,
  confirmation,
  confirmationArg,
  beforeConfirm,
  onOpenChange,
  modalPath,
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

  /**
   * If `modalPath` is specified, then only show the modal if the current
   * pathname actually matches the specified route template
   */
  if (modalPath != null) {
    const matchTemplate = match(supportedPathTemplates[modalPath], {
      decode: decodeURIComponent,
    });
    if (!matchTemplate(pathname)) {
      return null;
    }
  }

  return (
    <NextUIModal
      // This ensure the modal is remounted whenever the route changes
      key={pathname}
      onOpenChange={customOnOpenChange}
      {...props}
    />
  );
};
