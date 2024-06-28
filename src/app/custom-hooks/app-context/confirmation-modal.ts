import React from 'react';
import { useConfirmationModal } from '~/view/base/confirmation-modal/helper';

export type ConfirmationState = Readonly<{
  confirmationModal: ReturnType<typeof useConfirmationModal>;
}>;

export function useConfirmationModalContext() {
  const confirmationModal = useConfirmationModal();

  const contextValue = React.useMemo<ConfirmationState>(
    () => ({ confirmationModal }),
    [confirmationModal]
  );

  return contextValue;
}
