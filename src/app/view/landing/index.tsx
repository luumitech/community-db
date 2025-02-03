import { cn } from '@heroui/react';
import React from 'react';
import { GettingStarted } from './getting-started';
import { Hero } from './hero';
import { SignUpReason } from './sign-up-reason';

interface Props {
  className?: string;
}

export const Landing: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <Hero />
      <GettingStarted />
      <SignUpReason />
    </div>
  );
};
