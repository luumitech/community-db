import { useDisclosure } from '@heroui/react';
import React from 'react';

/**
 * Built on top of the `useDisclosure` hook,
 *
 * In addition to controlling the state of modal, it allows passing arbitrary
 * arguments into the modal when it is opened. And clears the arguments once it
 * closes
 */
export function useModalArg<T>() {
  const modalArg = React.useRef<T>();
  const disclosure = useDisclosure({
    onClose: () => {
      modalArg.current = undefined;
    },
  });
  const { onOpen } = disclosure;
  const open = React.useCallback(
    (arg: T) => {
      modalArg.current = arg;
      onOpen();
    },
    [onOpen]
  );

  return {
    /**
     * Open the modal dialog and pass in additional arguments to be used for
     * rendering the modal
     */
    open,
    /** Modal state controls */
    disclosure,
    /** Arguments passed into the Modal when it opens */
    modalArg: modalArg.current,
  };
}
