import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { type ConfirmationModalArg } from '~/view/base/confirmation-modal';

export type ConfirmationState = Readonly<{
  confirmationModal: ReturnType<typeof useModalArg<ConfirmationModalArg>>;
}>;

export function useConfirmationModalContext() {
  const confirmationModal = useModalArg<ConfirmationModalArg>();

  const contextValue = React.useMemo<ConfirmationState>(
    () => ({ confirmationModal }),
    [confirmationModal]
  );

  return contextValue;
}
