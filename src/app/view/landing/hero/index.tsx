'use client';
import { Button, Link } from '@nextui-org/react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { appTitle } from '~/lib/env-var';
import { SignInButton } from '~/view/header/not-signed-in/sign-in-button';
import heroImg from './community-with-people-2.jpeg';

interface Props {
  className?: string;
}

export const Hero: React.FC<Props> = ({ className }) => {
  const { status } = useSession();

  return (
    <div className={clsx(className, 'flex items-center justify-center')}>
      <Image src={heroImg} alt="Community With People" priority />
      <div
        className={clsx(
          'absolute bg-opacity-50 bg-background rounded-xl m-5 p-5',
          'text-center text-wrap space-y-4'
        )}
      >
        <div className="text-5xl font-extrabold">{appTitle}</div>
        <div className="text-2xl">
          A safe and secure way to manage your community membership information
        </div>
        {status === 'authenticated' ? (
          <Button
            as={Link}
            className="bg-gradient-to-tr from-pink-500 to-orange-500 text-white"
            href="/community"
          >
            Get Started
          </Button>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
};
