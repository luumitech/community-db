import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { useHookForm } from './use-hook-form';
import { VerifyOtp } from './verify-otp';

export interface VerifyEmailOtpProps {
  className?: string;
  email?: string;
}

export const VerifyEmailOtp: React.FC<VerifyEmailOtpProps> = ({
  className,
  email = '',
}) => {
  const { formMethods } = useHookForm();

  return (
    <FormProvider {...formMethods}>
      <VerifyOtp email={email} />
    </FormProvider>
  );
};
