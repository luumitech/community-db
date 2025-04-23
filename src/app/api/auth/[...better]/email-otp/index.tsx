import { render } from '@react-email/components';
import { type EmailOTPOptions } from 'better-auth/plugins';
import React from 'react';
import OtpEmail from '~/../emails/otp-code';
import { appTitle } from '~/lib/env-var';
import { Nodemailer } from '~/lib/nodemailer';

/**
 * Implement the sendVerificationOTP method to send the OTP to the user's email
 * address
 */
export const sendVerificationOTP: EmailOTPOptions['sendVerificationOTP'] =
  async ({ email, otp, type }) => {
    const html = await render(<OtpEmail email={email} otp={otp} />);

    const text = `${appTitle}

Let's get you signed in

Please use this code to login:
${otp}

All the best,
${appTitle} Team`;

    const mailer = await Nodemailer.fromConfig();
    await mailer.sendMail({
      to: email,
      subject: `${appTitle}: your login code`,
      text,
      html,
    });
  };
