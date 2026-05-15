'use client';
import { Link } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { Button, type ButtonProps } from '~/view/base/button';

export interface SignInButtonProps extends ButtonProps {
  className?: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  className,
  ...props
}) => {
  const query = useSearchParams();
  const callbackUrl = query.get('callbackUrl');

  return (
    <Button
      className={className}
      color="primary"
      as={Link}
      href={appPath('signIn', {
        query: {
          // Propagate callbackURL to sign in page
          ...(callbackUrl && { callbackUrl }),
        },
      })}
      {...props}
    >
      Sign In
    </Button>
  );
};
