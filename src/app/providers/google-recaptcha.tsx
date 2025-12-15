import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { env } from 'next-runtime-env';

interface Props {}

export const GoogleRecaptchaProviders: React.FC<
  React.PropsWithChildren<Props>
> = ({ children }) => {
  return (
    <ReCaptchaProvider
      reCaptchaKey={env('NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY')}
    >
      {children}
    </ReCaptchaProvider>
  );
};
