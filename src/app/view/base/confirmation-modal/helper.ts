import { useDisclosure, type ModalProps } from '@heroui/react';
import React from 'react';

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

/**
 * Helper hook for managing the confirmation Modal dialog
 *
 * The confirmation modal is installed once in the app, and this hook is used by
 * the AppContext to control its behavior
 */
export function useConfirmationModal() {
  const disclosure = useDisclosure();
  const modalArg = React.useRef<ConfirmationModalArg>();
  const { onOpen } = disclosure;
  const open = React.useCallback(
    (arg?: ConfirmationModalArg) => {
      modalArg.current = arg;
      onOpen();
    },
    [onOpen]
  );

  return {
    /**
     * Open the confirmation dialog can optionally pass in additional arguments
     * to control its appearance and/or behavior
     */
    open,
    /** Confirmation modal state controls */
    disclosure,
    /** Contains information necessary to render the Modal */
    modalArg: modalArg.current,
  };
}
