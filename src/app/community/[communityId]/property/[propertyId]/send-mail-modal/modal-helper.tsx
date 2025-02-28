import { useDisclosure } from '@heroui/react';
import React from 'react';
import { type OccupantList } from './_type';

export interface ModalArg {
  occupantList: OccupantList;
  membershipYear: number;
}

/** Helper hook for managing the send mail confirmation Modal dialog */
export function useSendMailModal() {
  const disclosure = useDisclosure();
  const modalArg = React.useRef<ModalArg>();
  const { onOpen } = disclosure;
  const open = React.useCallback(
    (arg?: ModalArg) => {
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
