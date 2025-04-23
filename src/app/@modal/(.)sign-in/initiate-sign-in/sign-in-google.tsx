import { Button } from '@heroui/react';
import React from 'react';
import { useSignIn } from '~/custom-hooks/auth';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
}

export const SignInGoogle: React.FC<Props> = ({ className }) => {
  const { signIn, callbackURL } = useSignIn();

  const doSignIn = React.useCallback(async () => {
    await signIn.social({ provider: 'google', callbackURL });
  }, [signIn, callbackURL]);

  return (
    <Button
      className={className}
      startContent={<Icon icon="google" size={24} />}
      variant="bordered"
      onPress={doSignIn}
    >
      Continue with Google
    </Button>
  );
};
