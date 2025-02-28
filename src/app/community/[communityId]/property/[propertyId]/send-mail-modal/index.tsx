import hash from 'object-hash';
import React from 'react';
import { usePageContext } from '../page-context';
import { SendMailModalDialog } from './modal-dialog';
export { useSendMailModal } from './modal-helper';

interface Props {}

export const SendMailConfirmation: React.FC<Props> = ({}) => {
  const { sendMail } = usePageContext();
  const { modalArg, disclosure } = sendMail;

  if (modalArg == null) {
    return null;
  }

  return (
    <SendMailModalDialog
      // Make sure the modal is re-rendered with modalArg is modified
      key={hash(modalArg)}
      {...modalArg}
      disclosure={disclosure}
    />
  );
};
