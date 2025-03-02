import { useReCaptcha } from 'next-recaptcha-v3';
import React from 'react';
import { tsr } from '~/tsr';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog } from './modal-dialog';
import { type InputData } from './use-hook-form';

interface Props {}

export const SendMailModal: React.FC<Props> = ({}) => {
  const { sendMail } = usePageContext();
  const { modalArg, disclosure } = sendMail;
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

  if (modalArg == null) {
    return null;
  }

  return <ModalDialog {...modalArg} disclosure={disclosure} onSave={onSave} />;
};
