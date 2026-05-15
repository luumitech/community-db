import { cn } from '@heroui/react';
import React from 'react';
import { authClient } from '~/custom-hooks/auth';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Icon } from '~/view/base/icon';
import { createInput } from '~/view/base/input';
import { Modal } from '~/view/base/modal';
import { toast } from '~/view/base/toastify';
import { Wizard } from '../wizard';
import { useHookFormContext, type InputData } from './use-hook-form';

const Input = createInput<InputData>();

interface Props {
  className?: string;
}

export const SendOtp: React.FC<Props> = ({ className }) => {
  const [pending, startTransition] = React.useTransition();
  const { goTo } = Wizard.useWizard();
  const formMethods = useHookFormContext();
  const { handleSubmit, formState } = formMethods;
  const { isDirty } = formState;

  const onSendOtp = React.useCallback(
    (input: InputData) =>
      startTransition(async () => {
        const { email } = input;
        const { data, error } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: 'sign-in',
        });
        if (error) {
          toast.error(error.message);
        }
        if (data?.success) {
          goTo('verifyEmailOTP', { email });
        }
      }),
    [goTo]
  );

  return (
    <Form
      className={cn(className, 'flex flex-col gap-4')}
      onSubmit={handleSubmit(onSendOtp)}
    >
      <Modal.Header className="flex flex-col items-center gap-2">
        <span className="text-3xl font-semibold">Enter your email</span>
        <p className="text-center text-sm font-normal text-foreground/60">
          We will send an OTP code to your email
        </p>
      </Modal.Header>
      <Modal.Body className="flex flex-col items-center gap-2">
        <Input
          isRequired
          controlName="email"
          label="Email Address"
          name="email"
          placeholder="Enter your email"
          variant="bordered"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          variant="bordered"
          isIconOnly
          isDisabled={!isDirty}
          isLoading={pending}
        >
          <Icon icon="forward" />
        </Button>
      </Modal.Footer>
    </Form>
  );
};
