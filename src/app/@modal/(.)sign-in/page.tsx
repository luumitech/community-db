'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { AppLogo } from '~/view/app-logo';
import { Modal, ModalContent } from '~/view/base/modal';
import { InitiateSignIn } from './initiate-sign-in';
import { SendEmailOtp } from './send-email-otp';
import { VerifyEmailOtp } from './verify-email-otp';
import { Wizard } from './wizard';

export default function SignIn() {
  const router = useRouter();

  return (
    <Modal
      size="sm"
      isOpen
      onOpenChange={() => router.back()}
      isKeyboardDismissDisabled
      isDismissable={false}
    >
      <ModalContent className="overflow-x-hidden">
        <div className="m-auto mt-6">
          <AppLogo size={64} onClick={() => router.push(appPath('home'))} />
        </div>
        <Wizard>
          <Wizard.Step name="signIn">
            <InitiateSignIn />
          </Wizard.Step>
          <Wizard.Step name="sendEmailOTP">
            <SendEmailOtp />
          </Wizard.Step>
          <Wizard.Step name="verifyEmailOTP">
            <VerifyEmailOtp />
          </Wizard.Step>
        </Wizard>
      </ModalContent>
    </Modal>
  );
}
