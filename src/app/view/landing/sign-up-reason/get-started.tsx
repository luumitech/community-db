'use client';
import { Link, cn } from '@heroui/react';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';

interface Props {
  className?: string;
}

export const GetStarted: React.FC<Props> = ({ className }) => {
  return (
    <Button
      as={Link}
      className={cn(
        className,
        'bg-linear-to-tr from-pink-500 to-orange-500 text-white'
      )}
      href={appPath('communityWelcome')}
    >
      Get Started
    </Button>
  );
};
