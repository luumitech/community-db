import {
  InputOtp as NextUIInputOtp,
  InputOtpProps as NextUIInputOtpProps,
  cn,
} from '@heroui/react';
import React from 'react';

export interface PlainInputOtpProps extends NextUIInputOtpProps {}

export const PlainInputOtp = React.forwardRef<
  HTMLInputElement,
  PlainInputOtpProps
>(({ isReadOnly, ...props }, ref) => {
  return (
    <NextUIInputOtp
      ref={ref}
      {...(!!isReadOnly && {
        isReadOnly: true,
        isDisabled: true,
      })}
      {...props}
    />
  );
});

PlainInputOtp.displayName = 'PlainInputOtp';
