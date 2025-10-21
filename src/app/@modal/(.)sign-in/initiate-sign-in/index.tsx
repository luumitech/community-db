import { ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import React from 'react';
import { isProduction } from '~/lib/env-var';
import { SignInDev } from './sign-in-dev';
import { SignInEmailOtp } from './sign-in-email-otp';
import { SignInSocial } from './sign-in-social';

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
        <SignInSocial
          provider="google"
          label="Continue with Google"
          icon="google"
        />
        <SignInSocial
          provider="facebook"
          label="Continue with Facebook"
          icon="facebook"
        />
        <SignInSocial provider="twitter" label="Continue with X" icon="x" />
        {!isProduction() && <SignInDev />}
      </ModalBody>
      <ModalFooter className="flex flex-col gap-4" />
    </>
  );
};
