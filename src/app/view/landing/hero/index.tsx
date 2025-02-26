'use client';
import { cn } from '@heroui/react';
import React from 'react';
import { appTitle } from '~/lib/env-var';
import { AppLogo } from '~/view/app-logo';
import { GoToWelcome } from '../go-to-welcome';

interface Props {
  className?: string;
}

export const Hero: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        className,
        // Make sure background covers entire screen
        'w-full min-h-main-height',
        'bg-[url(/image/community-with-people.png)] bg-cover bg-center'
      )}
    >
      {/* Render text box that prefers to be aligned slightly to the top */}
      <div className="px-6 py-6 sm:pt-[10vh] sm:px-12">
        <div
          className={cn(
            'flex flex-col items-center text-center text-wrap gap-6',
            'bg-opacity-80 bg-background rounded-xl p-5 sm:p-10'
          )}
        >
          <AppLogo size={96} />
          <h1 className="text-5xl font-extrabold">{appTitle}</h1>
          <p className="text-2xl">
            A simple and secure way to track, update, and organize member
            information, so you can focus on what matters most:
          </p>
          <p className="text-2xl font-bold">
            Growing and connecting your community!
          </p>
          <GoToWelcome />
        </div>
      </div>
    </div>
  );
};
