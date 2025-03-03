import { useReCaptcha } from 'next-recaptcha-v3';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { tsr } from '~/tsr';
import { toast } from '~/view/base/toastify';
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
  const { executeRecaptcha } = useReCaptcha();
  const mailSend = tsr.mail.send.useMutation();

  const onSave = React.useCallback(
    (_input: InputData) =>
      new Promise<void>(async (resolve, reject) => {
        const recaptchaToken = await executeRecaptcha('submit');
        const { subject, toEmail, hidden, ...input } = _input;
        const toEmailList = toEmail.split(',');
        const to = hidden.toItems
          .filter(({ email }) => toEmailList.includes(email))
          .map(({ email, fullName }) => ({ email, name: fullName }));
        mailSend.mutate(
          {
            query: { subject },
            body: { recaptchaToken, to, ...input },
          },
          {
            onSuccess: (data) => {
              toast.success('Confirmation email sent');
              resolve();
            },
            onError: reject,
          }
        );
      }),
    [executeRecaptcha, mailSend]
  );

  if (arg == null) {
    return null;
  }

  return <ModalDialog {...arg} disclosure={disclosure} onSave={onSave} />;
};
