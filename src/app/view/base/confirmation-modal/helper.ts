import { useDisclosure } from '@nextui-org/react';
import React from 'react';

export interface ConfirmationModalArg {
  bodyText?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Helper hook for managing the confirmation Modal dialog The confirmation modal
 * is installed once in the app, and this hook is used by the AppContext to
 * control its behavior
 */
export function useConfirmationModal() {
  const disclosure = useDisclosure();
  const modalArg = React.useRef<ConfirmationModalArg>();
  const { onOpen, onClose } = disclosure;
  const open = React.useCallback(
    (arg?: ConfirmationModalArg) => {
      modalArg.current = arg;
      onOpen();
    },
    [onOpen]
  );

  const onConfirm = () => {
    modalArg.current?.onConfirm?.();
    onClose();
  };
  const onCancel = () => {
    modalArg.current?.onCancel?.();
    onClose();
  };
  const getModalArgs = () => ({
    disclosure,
    onConfirm,
    onCancel,
    bodyText: modalArg.current?.bodyText,
  });

  return {
    /**
     * Open the confirmation dialog can optionally pass in additional arguments
     * to control its appearance and/or behavior
     */
    open,
    /** Contains information necessary to render the Modal */
    getModalArgs,
  };
}
