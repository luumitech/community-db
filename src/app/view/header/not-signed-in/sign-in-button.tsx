'use client';
import { Button, type ButtonProps } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { signIn } from '~/custom-hooks/auth';
import { appPath } from '~/lib/app-path';

export interface SignInButtonProps extends ButtonProps {
  className?: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  className,
  ...props
}) => {
  const query = useSearchParams();

  return (
    <Button
      className={className}
      color="primary"
      // startContent={<Icon icon="flat-color-icons:google" width={24} />}
      onPress={async () => {
        /** You can optionally force provider to google */
        // signIn(undefined, {
        //   callbackUrl: query.get('callbackUrl') ?? appPath('communityWelcome'),
        // });
        signIn.social({
          provider: 'google',
          callbackURL: query.get('callbackUrl') ?? appPath('communityWelcome'),
        });
      }}
      {...props}
    >
      Sign In
    </Button>
  );
};
