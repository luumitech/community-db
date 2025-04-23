import { Divider, ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import React from 'react';
import { isProduction } from '~/lib/env-var';
import { SendEmailOtp } from './send-email-otp';
import { SignInDev } from './sign-in-dev';
import { SignInGoogle } from './sign-in-google';

interface Props {
  className?: string;
}

export const InitiateSignIn: React.FC<Props> = ({ className }) => {
  return (
    <>
      <ModalHeader className="flex flex-col items-center text-3xl font-semibold">
        Sign In
      </ModalHeader>
      <ModalBody className="flex flex-col gap-2">
        <SendEmailOtp />
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <SignInGoogle />
        {!isProduction() && <SignInDev />}
      </ModalBody>
      <ModalFooter className="flex flex-col gap-4" />
    </>
  );
};
