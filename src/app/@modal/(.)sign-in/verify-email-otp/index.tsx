import { InputOtp } from '@heroui/input-otp';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSignIn } from '~/custom-hooks/auth';

interface Props {
  className?: string;
}

export const VerifyEmailOtp: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const { signInGoogle, signInDev } = useSignIn();

  return (
    <>
      <ModalHeader className="flex flex-col items-center gap-2">
        <span className="text-3xl font-semibold ">Verify your email</span>
        <span className="text-sm font-normal text-default-400">
          Enter your OTP code here
        </span>
      </ModalHeader>
      <ModalBody className="flex flex-col gap-2 items-center">
        <InputOtp
          variant="bordered"
          length={6}
          size="md"
          isInvalid
          errorMessage="Invalid OTP"
        />
        <span className="pt-6 text-sm font-normal text-default-400">
          Didn't receive any code?
        </span>
        <Button
          variant="light"
          color="secondary"
          onPress={() => {
            // resend code
          }}
        >
          Resend New Code
        </Button>
      </ModalBody>
      <ModalFooter>
        <Button color="primary">Verify</Button>
      </ModalFooter>
    </>
  );
};
