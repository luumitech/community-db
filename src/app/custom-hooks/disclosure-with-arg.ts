import { useDisclosure } from '@heroui/react';
import React from 'react';

/**
 * Built on top of the `useDisclosure` hook,
 *
 * In addition to controlling the open/close state, it introduces a new method
 * to pass arbitrary arguments when opening.
 *
 * It also clears the arguments when closing.
 *
 * This will allow one to render Modal or Drawer with the arguments passed into
 * the `open()` method without caching previous rendering
 */
export function useDisclosureWithArg<T>() {
  const arg = React.useRef<T>(null);
  const disclosure = useDisclosure({
    onClose: () => {
      arg.current = null;
    },
  });
  const { onOpen } = disclosure;
  const open = React.useCallback(
    (_arg: T) => {
      arg.current = _arg;
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
    arg: arg.current,
  };
}
