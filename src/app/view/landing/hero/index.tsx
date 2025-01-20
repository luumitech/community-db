'use client';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { appTitle } from '~/lib/env-var';
import { GoToWelcome } from '../go-to-welcome';
import heroImg from './community-with-people.png';

interface Props {
  className?: string;
}

export const Hero: React.FC<Props> = ({ className }) => {
  const { status } = useSession();

  return (
    <div className={clsx(className, 'flex items-center justify-center')}>
      <Image
        // Makes sure min width/height can contain the hero text
        className="h-main-height w-full min-h-[400px] min-w-[300px] object-cover"
        src={heroImg}
        alt="Community With People"
        priority
      />
      <div
        className={clsx(
          'absolute bg-opacity-80 bg-background rounded-xl m-5 p-5',
          'flex flex-col items-center text-center text-wrap gap-4'
        )}
      >
        <Image
          // Makes sure min width/height can contain the hero text
          className="object-fit rounded-md"
          src="/image/community-db-logo.png"
          alt="Community DB Logo"
          width={72}
          height={72}
        />
        <div className="text-5xl font-extrabold">{appTitle}</div>
        <div className="text-2xl">
          A safe and secure way to manage your community membership information
        </div>
        <GoToWelcome />
      </div>
    </div>
  );
};
