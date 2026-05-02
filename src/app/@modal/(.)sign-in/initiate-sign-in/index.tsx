import React from 'react';
import { isProduction } from '~/lib/env';
import { Modal } from '~/view/base/modal';
import { SignInDev } from './sign-in-dev';
import { SignInEmailOtp } from './sign-in-email-otp';
import { SignInSocial } from './sign-in-social';

export interface InitiateSignInProps {
  className?: string;
}

export const InitiateSignIn: React.FC<InitiateSignInProps> = ({
  className,
}) => {
  return (
    <>
      <Modal.Header className="flex flex-col items-center text-3xl font-semibold">
        Sign In
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-2">
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
      </Modal.Body>
      <Modal.Footer className="flex flex-col gap-4" />
    </>
  );
};
