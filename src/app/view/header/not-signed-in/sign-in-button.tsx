'use client';
import { Button } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';

interface Props {
  className?: string;
}

export const SignInButton: React.FC<Props> = ({ className }) => {
  const query = useSearchParams();

  return (
    <Button
      className={className}
      color="primary"
      onPress={() => {
        /** You can optionally force provider to google */
        signIn(undefined, {
          callbackUrl: query.get('callbackUrl') ?? appPath('communityWelcome'),
        });
      }}
    >
      Sign In
    </Button>
  );
};
