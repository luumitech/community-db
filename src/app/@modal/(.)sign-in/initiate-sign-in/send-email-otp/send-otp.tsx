import { Button, cn } from '@heroui/react';
import React from 'react';
import { authClient } from '~/custom-hooks/auth';
import { Form } from '~/view/base/form';
import { Icon } from '~/view/base/icon';
import { Input } from '~/view/base/input';
import { toast } from '~/view/base/toastify';
import { usePanelContext } from '../../panel-context';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props {
  className?: string;
}

export const SendOtp: React.FC<Props> = ({ className }) => {
  const [pending, startTransition] = React.useTransition();
  const { goToPanel } = usePanelContext();
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
          goToPanel('verify-email-otp', { email });
        }
      }),
    [goToPanel]
  );

  return (
    <Form
      className={cn(className, 'flex flex-col gap-4')}
      onSubmit={handleSubmit(onSendOtp)}
    >
      <Input
        isRequired
        controlName="email"
        label="Email Address"
        name="email"
        placeholder="Enter your email"
        variant="bordered"
      />
      <Button
        startContent={<Icon icon="email" size={24} />}
        type="submit"
        variant="bordered"
        isDisabled={!isDirty}
        isLoading={pending}
      >
        Continue with Email
      </Button>
    </Form>
  );
};
