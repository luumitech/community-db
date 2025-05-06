import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { QueryModal, type ModalArg } from './query-modal';

export { type ModalArg } from './query-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

interface Props {
  modalControl: ModalControl;
}

export const GenerateEmailListModal: React.FC<Props> = ({ modalControl }) => {
  const { arg, disclosure } = modalControl;

  if (arg == null) {
    return null;
  }

  return <QueryModal {...arg} disclosure={disclosure} />;
};
