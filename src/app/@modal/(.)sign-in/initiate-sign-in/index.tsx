import { ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import React from 'react';
import { isProduction } from '~/lib/env-var';
import { SignInDev } from './sign-in-dev';
import { SignInEmailOtp } from './sign-in-email-otp';
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
        <SignInEmailOtp />
        <SignInGoogle />
        {!isProduction() && <SignInDev />}
      </ModalBody>
      <ModalFooter className="flex flex-col gap-4" />
    </>
  );
};
