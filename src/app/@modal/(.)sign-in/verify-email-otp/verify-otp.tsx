import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  cn,
} from '@heroui/react';
import React from 'react';
import { authClient, useSignIn } from '~/custom-hooks/auth';
import { Form } from '~/view/base/form';
import { InputOtp } from '~/view/base/input-otp';
import { toast } from '~/view/base/toastify';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props {
  className?: string;
  email: string;
}

export const VerifyOtp: React.FC<Props> = ({ className, email }) => {
  const [sendingOtp, onSendOtp] = React.useTransition();
  const [signingIn, onSignIn] = React.useTransition();
  const { callbackURL, signIn } = useSignIn();
  const formMethods = useHookFormContext();
  const { setError, clearErrors } = formMethods;

  const doSendOtp = React.useCallback(
    () =>
      onSendOtp(async () => {
        const { data, error } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: 'sign-in',
        });
        if (error) {
          toast.error(error.message);
        }
        if (data?.success) {
          toast.success('New OTP code sent to your email');
        }
      }),
    [email]
  );

  const doSignIn = React.useCallback(
    (input: InputData) =>
      onSignIn(async () => {
        const { otp } = input;
        const { error } = await signIn.emailOtp({
          email,
          otp,
          fetchOptions: {
            onSuccess: () => {
              /**
               * Router.push failed to dismiss the modal dialog, as a workaround
               * use `window.location.href` instead.
               */
              window.location.href = callbackURL;
            },
          },
        });
        if (error) {
          setError('otp', { message: error.message });
        }
      }),
    [signIn, email, callbackURL, setError]
  );

  return (
    <Form
      className={cn(className, 'flex flex-col gap-4')}
      // onSubmit={handleSubmit(doSignIn)}
    >
      <ModalHeader className="flex flex-col items-center gap-2">
        <span className="text-3xl font-semibold ">Verify your email</span>
        <p className="text-center text-sm font-normal text-default-400">
          We&apos;ve sent an OTP code to <span className="italic">{email}</span>
          <br />
          Enter your OTP code here
        </p>
      </ModalHeader>
      <ModalBody className="flex flex-col gap-2 items-center">
        <InputOtp
          classNames={{
            // width of 6 digit OTP input
            // This is necessary, so lengthy error message does not
            // expand the OTP inptu field
            helperWrapper: 'max-w-[260px]',
          }}
          autoFocus
          controlName="otp"
          variant="bordered"
          length={6}
          size="md"
          isDisabled={signingIn}
          onValueChange={(value) => {
            clearErrors('otp');
            if (value?.length === 6) {
              doSignIn({ otp: value });
            }
          }}
        />
        <span className="pt-6 text-sm font-normal text-default-400">
          Didn&apos;t receive any code?
        </span>
        <Button
          variant="light"
          color="danger"
          isLoading={sendingOtp}
          onPress={doSendOtp}
        >
          Resend New Code
        </Button>
      </ModalBody>
      <ModalFooter>{signingIn && <Spinner />}</ModalFooter>
    </Form>
  );
};
