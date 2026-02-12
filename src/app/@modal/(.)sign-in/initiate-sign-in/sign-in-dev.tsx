import { Button } from '@heroui/react';
import React from 'react';
import { useSignIn } from '~/custom-hooks/auth';
import { isProduction } from '~/lib/env';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
}

export const SignInDev: React.FC<Props> = ({ className }) => {
  const { signIn, signUp, callbackURL } = useSignIn();

  /** Sign in as developer (internal use only) */
  const doSignIn = React.useCallback(async () => {
    await signUp.email({
      name: 'Dev User',
      email: 'dev@email.com',
      image: '/image/dev-avatar.png',
      password: 'password1234',
    });
    return signIn.email({
      email: 'dev@email.com',
      password: 'password1234',
      callbackURL,
    });
  }, [callbackURL, signIn, signUp]);

  // Only available in development mode
  if (isProduction()) {
    return null;
  }

  return (
    <Button
      className={className}
      startContent={<Icon icon="settings" size={24} />}
      variant="bordered"
      onPress={doSignIn}
    >
      Developer (Internal use only)
    </Button>
  );
};
