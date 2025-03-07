import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { type ConfirmationModalArg } from '~/view/base/confirmation-modal';

export type ConfirmationState = Readonly<{
  confirmationModal: ReturnType<
    typeof useDisclosureWithArg<ConfirmationModalArg>
  >;
}>;

export function useConfirmationModalContext() {
  const confirmationModal = useDisclosureWithArg<ConfirmationModalArg>();

  const contextValue = React.useMemo<ConfirmationState>(
    () => ({ confirmationModal }),
    [confirmationModal]
  );

  return contextValue;
}
