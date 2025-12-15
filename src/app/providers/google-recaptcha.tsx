import { ReCaptchaProvider } from 'next-recaptcha-v3';

interface Props {
  reCaptchaKey: string;
}

export const GoogleRecaptchaProviders: React.FC<
  React.PropsWithChildren<Props>
> = ({ reCaptchaKey, children }) => {
  return (
    <ReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      {children}
    </ReCaptchaProvider>
  );
};
