'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { tsr } from '~/tsr';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';
import { EmailEditor } from './email-editor';
import { InputData, useHookForm } from './use-hook-form';

export default function ContactUs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get('title') ?? 'Contact Us';
  const subject = searchParams.get('subject') ?? 'General Inquiry';
  const mailSend = tsr.mail.send.useMutation({
    onSuccess: () => {
      toast.success('Thank you. Our team will contact you shortly.');
      router.back();
    },
  });
  const { formMethods } = useHookForm(subject);
  const { formState, handleSubmit } = formMethods;
  const { isDirty } = formState;

  const onSend = React.useCallback(
    async (input: InputData) => {
      const { message, ...other } = input;
      mailSend.mutate({
        query: other,
        body: { message },
      });
    },
    [mailSend]
  );

  return (
    <Modal
      size="lg"
      scrollBehavior="inside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSend)}>
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <EmailEditor />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                color="primary"
                isDisabled={!isDirty}
                endContent={<Icon icon="email" />}
              >
                Send
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </FormProvider>
    </Modal>
  );
}
