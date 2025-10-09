'use client';
import { Button, Link, cn } from '@heroui/react';
import React from 'react';
import { appPath } from '~/lib/app-path';

interface Props {
  className?: string;
}

export const GetStarted: React.FC<Props> = ({ className }) => {
  return (
    <Button
      as={Link}
      className={cn(
        className,
        'bg-gradient-to-tr from-pink-500 to-orange-500 text-white'
      )}
      href={appPath('communityWelcome')}
    >
      Get Started
    </Button>
  );
};
