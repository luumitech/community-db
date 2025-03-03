import queryString from 'query-string';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { ModalDialog, type ModalArg } from './modal-dialog';
import { type InputData } from './use-hook-form';

export { type ModalArg } from './modal-dialog';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

interface Props {
  modalControl: ModalControl;
}

export const SendMailModal: React.FC<Props> = ({ modalControl }) => {
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(async (_input: InputData) => {
    const { subject, toEmail, message } = _input;
    const toEmailList = toEmail.split(',');
    const url = queryString.stringifyUrl({
      url: `mailto:${toEmailList}`,
      query: {
        subject,
        body: message,
      },
    });
    document.location.href = url.toString();
  }, []);

  if (arg == null) {
    return null;
  }

  return <ModalDialog {...arg} disclosure={disclosure} onSave={onSave} />;
};
