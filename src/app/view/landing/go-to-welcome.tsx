'use client';
import { Button, cn } from '@heroui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { SignInButton } from '~/view/header/not-signed-in/sign-in-button';

interface Props {
  className?: string;
}

export const GoToWelcome: React.FC<Props> = ({ className }) => {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    return (
      <Button
        className={cn(
          className,
          'bg-gradient-to-tr from-pink-500 to-orange-500 text-white'
        )}
        onPress={() => router.push(appPath('communityWelcome'))}
      >
        Get Started
      </Button>
    );
  }

  return <SignInButton className={className} />;
};
