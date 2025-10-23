import { Button } from '@heroui/react';
import React from 'react';
import { useSignIn } from '~/custom-hooks/auth';
import { Icon, type IconType } from '~/view/base/icon';

interface Props {
  className?: string;
  provider: 'google' | 'facebook' | 'twitter';
  icon: IconType;
  label: string;
}

export const SignInSocial: React.FC<Props> = ({
  className,
  provider,
  icon,
  label,
}) => {
  const { signIn, callbackURL } = useSignIn();

  const doSignIn = React.useCallback(async () => {
    await signIn.social({ provider, callbackURL });
  }, [signIn, provider, callbackURL]);

  return (
    <Button
      className={className}
      startContent={<Icon icon={icon} size={24} />}
      variant="bordered"
      onPress={doSignIn}
    >
      {label}
    </Button>
  );
};
