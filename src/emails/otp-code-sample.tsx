/**
 * This is intended to test the `otp.code.tsx` email template, you can start the
 * react-email preview server:
 *
 *     yarn email-dev
 *
 * The dotenv is necessary because react-email does not handle .env files
 * correctly:
 *
 * See: https://github.com/resend/react-email/issues/668
 */
import 'dotenv/config';

import React from 'react';
import { OtpCode } from './template/otp-code';

export default function OtpCodeSample() {
  return <OtpCode email="noreply@example.com" otp="123456" />;
}
