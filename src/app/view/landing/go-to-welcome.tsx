'use client';
import { Button, Link } from '@nextui-org/react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import React from 'react';
import { SignInButton } from '~/view/header/not-signed-in/sign-in-button';

interface Props {
  className?: string;
}

export const GoToWelcome: React.FC<Props> = ({ className }) => {
  const { status } = useSession();

  if (status === 'authenticated') {
    return (
      <Button
        as={Link}
        className={clsx(
          className,
          'bg-gradient-to-tr from-pink-500 to-orange-500 text-white'
        )}
        href="/community"
      >
        Get Started
      </Button>
    );
  }

  return <SignInButton className={className} />;
};
