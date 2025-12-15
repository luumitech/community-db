import { render } from '@react-email/components';
import { type EmailOTPOptions } from 'better-auth/plugins';
import React from 'react';
import { OtpCode } from '~/../emails/template/otp-code';
import { appTitle } from '~/lib/env';
import { Nodemailer } from '~/lib/nodemailer';

/**
 * Implement the sendVerificationOTP method to send the OTP to the user's email
 * address
 */
export const sendVerificationOTP: EmailOTPOptions['sendVerificationOTP'] =
  async ({ email, otp, type }) => {
    const jsx = <OtpCode email={email} otp={otp} />;

    const html = await render(jsx);
    const text = await render(jsx, { plainText: true });

    const mailer = await Nodemailer.fromConfig();
    await mailer.sendMail({
      to: email,
      subject: `${appTitle}: your login code`,
      text,
      html,
    });
  };
