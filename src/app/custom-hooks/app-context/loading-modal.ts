import { useDisclosure } from '@heroui/react';
import React from 'react';

export type LoadingState = Readonly<{
  loadingModal: {
    isLoading: boolean;
    setLoading: (open: boolean) => void;
  };
}>;

export function useLoadingModalContext() {
  const loadingModal = useDisclosure();
  const { isOpen, onOpen, onClose } = loadingModal;

  const setLoading = React.useCallback(
    (open: boolean) => {
      if (open) {
        onOpen();
      } else {
        onClose();
      }
    },
    [onOpen, onClose]
  );

  const contextValue = React.useMemo<LoadingState>(
    () => ({
      loadingModal: {
        isLoading: isOpen,
        setLoading,
      },
    }),
    [isOpen, setLoading]
  );

  return contextValue;
}
