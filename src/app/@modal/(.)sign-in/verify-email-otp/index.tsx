import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { useHookForm } from './use-hook-form';
import { VerifyOtp } from './verify-otp';

interface Props {
  className?: string;
  email?: string;
}

export const VerifyEmailOtp: React.FC<Props> = ({ className, email = '' }) => {
  const { formMethods } = useHookForm();

  return (
    <FormProvider {...formMethods}>
      <VerifyOtp email={email} />
    </FormProvider>
  );
};
