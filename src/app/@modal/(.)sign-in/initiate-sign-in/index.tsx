import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSignIn } from '~/custom-hooks/auth';
import { isProduction } from '~/lib/env-var';
import { AppLogo } from '~/view/app-logo';
import { Icon } from '~/view/base/icon';
import { SendEmailOtp } from './send-email-otp';

interface Props {
  className?: string;
}

export const InitiateSignIn: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { signInGoogle, signInDev } = useSignIn();

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
        <Button
          startContent={<Icon icon="google" size={24} />}
          variant="bordered"
          onPress={signInGoogle}
        >
          Continue with Google
        </Button>
      </ModalBody>
      <ModalFooter className="flex flex-col gap-4">
        {!isProduction() && (
          <>
            <Divider />
            <Button
              startContent={<Icon icon="settings" size={24} />}
              variant="bordered"
              onPress={signInDev}
            >
              Developer (Internal use only)
            </Button>
          </>
        )}
      </ModalFooter>
    </>
  );
};
