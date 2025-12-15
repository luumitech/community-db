'use client';
import {
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as R from 'remeda';
import { FormProvider } from '~/custom-hooks/hook-form';
import { appTitle } from '~/lib/env';
import { tsr } from '~/providers/tsr';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';
import { EmailEditor } from './email-editor';
import { InputData, useHookForm } from './use-hook-form';

interface SearchParams {
  /** Title of the modal */
  title?: string;
  /** Subject of contact form */
  subject?: string;
  /** Description to be included under the message input field */
  messageDescription?: string;
  /** Include server log in the email */
  log?: 'true';
}

interface Params {}

interface RouteArgs {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export default function ContactUs(props: RouteArgs) {
  const {
    title = 'Contact Us',
    subject: defaultSubject = 'General Inquiry',
    messageDescription,
    log,
  } = React.use(props.searchParams);
  const router = useRouter();
  const { executeRecaptcha } = useReCaptcha();
  const mailSend = tsr.mail.send.useMutation();
  const { formMethods } = useHookForm(defaultSubject);
  const { formState, handleSubmit } = formMethods;
  const { isDirty } = formState;

  const onSend = React.useCallback(
    async (input: InputData) => {
      const { subject, contactName, contactEmail } = input;
      const recaptchaToken = await executeRecaptcha('submit');
      const message = [
        `Source: ${appTitle}`,
        'Contact Info:',
        `Name: ${R.isEmpty(contactName) ? '(n/a)' : contactName}`,
        `Email: ${contactEmail}`,
        '',
        input.message,
      ].join('\n');
      mailSend.mutate(
        {
          query: {
            subject,
            // Enable log, if specified
            ...(log != null && { log }),
          },
          body: { recaptchaToken, to: [], message },
        },
        {
          onSuccess: () => {
            toast.success('Thank you. Our team will contact you shortly.');
            router.back();
          },
        }
      );
    },
    [executeRecaptcha, log, mailSend, router]
  );

  return (
    <Modal
      size="lg"
      placement="top-center"
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
              <EmailEditor messageDescription={messageDescription} />
            </ModalBody>
            <ModalFooter className="items-center">
              <div className="text-xs">
                This site is protected by reCAPTCHA and the Google{' '}
                <Link
                  className="text-xs"
                  href="https://policies.google.com/privacy"
                  isExternal
                  showAnchorIcon
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  className="text-xs"
                  href="https://policies.google.com/terms"
                  isExternal
                  showAnchorIcon
                >
                  Terms of Service
                </Link>{' '}
                apply.
              </div>
              <Button
                className="min-w-24"
                type="submit"
                color="primary"
                isDisabled={!isDirty}
                isLoading={mailSend.isPending}
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
