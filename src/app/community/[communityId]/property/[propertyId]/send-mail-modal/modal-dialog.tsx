import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import { useReCaptcha } from 'next-recaptcha-v3';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { tsr } from '~/tsr';
import { Form } from '~/view/base/form';
import { toast } from '~/view/base/toastify';
import { type OccupantList } from './_type';
import { MailForm } from './mail-form';
import { useHookForm, type InputData } from './use-hook-form';
export { useSendMailModal } from './modal-helper';

interface Props {
  membershipYear: number;
  occupantList: OccupantList;
  disclosure: UseDisclosureReturn;
}

export const SendMailModalDialog: React.FC<Props> = ({
  membershipYear,
  occupantList,
  disclosure,
}) => {
  const { formMethods } = useHookForm(membershipYear, occupantList);
  const { handleSubmit } = formMethods;
  const { executeRecaptcha } = useReCaptcha();
  const mailSend = tsr.mail.send.useMutation();

  const onSend = React.useCallback(
    async (_input: InputData) => {
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
            disclosure.onClose();
          },
        }
      );
    },
    [executeRecaptcha, mailSend]
  );

  return (
    <Modal
      size="2xl"
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      scrollBehavior="outside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSend)}>
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader>Send Confirmation Email?</ModalHeader>
                <ModalBody>
                  <MailForm />
                </ModalBody>
                <ModalFooter>
                  <Button onPress={closeModal}>No</Button>
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={mailSend.isPending}
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
};
