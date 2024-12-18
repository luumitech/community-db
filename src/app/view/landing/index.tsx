import clsx from 'clsx';
import React from 'react';
import { GettingStarted } from './getting-started';
import { Hero } from './hero';
import { SignUpReason } from './sign-up-reason';

interface Props {
  className?: string;
}

export const Landing: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className)}>
      <Hero />
      <GettingStarted />
      <SignUpReason />
    </div>
  );
};
