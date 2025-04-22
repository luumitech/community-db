'use client';
import { Button, Link, type ButtonProps } from '@heroui/react';
import React from 'react';
import { appPath } from '~/lib/app-path';

export interface SignInButtonProps extends ButtonProps {
  className?: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <Button
      className={className}
      color="primary"
      as={Link}
      href={appPath('signIn')}
      {...props}
    >
      Sign In
    </Button>
  );
};
