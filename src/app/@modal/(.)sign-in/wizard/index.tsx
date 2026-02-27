import { createAnimatedWizard } from '~/view/base/animated-wizard';
import type { InitiateSignInProps } from '../initiate-sign-in';
import type { SendEmailOtpProps } from '../send-email-otp';
import type { VerifyEmailOtpProps } from '../verify-email-otp';

interface Steps {
  signIn: InitiateSignInProps;
  sendEmailOTP: SendEmailOtpProps;
  verifyEmailOTP: VerifyEmailOtpProps;
}
export const Wizard = createAnimatedWizard<Steps>();
