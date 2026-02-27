import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { SendOtp } from './send-otp';
import { useHookForm } from './use-hook-form';

export interface SendEmailOtpProps {
  className?: string;
}

export const SendEmailOtp: React.FC<SendEmailOtpProps> = ({ className }) => {
  const { formMethods } = useHookForm();

  return (
    <FormProvider {...formMethods}>
      <SendOtp />
    </FormProvider>
  );
};
