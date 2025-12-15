'use client';
import { Link, cn } from '@heroui/react';
import React from 'react';
import { useSession } from '~/custom-hooks/auth';
import { appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env';
import { AppLogo } from '~/view/app-logo';
import { SignInButton } from '~/view/header/not-signed-in/sign-in-button';
import { QuickStart } from './quick-start';

interface Props {
  className?: string;
}

export const Hero: React.FC<Props> = ({ className }) => {
  const session = useSession();

  return (
    <div
      className={cn(
        // Make sure background covers entire screen
        'min-h-main-height w-full',
        'bg-[url(/image/community-with-people.png)] bg-cover bg-center',
        className
      )}
    >
      {/* Render text box that prefers to be aligned slightly to the top */}
      <div className="px-6 py-6 sm:px-12 sm:pt-[10vh]">
        <div
          className={cn(
            'flex flex-col items-center gap-6 text-center text-wrap',
            'bg-opacity-80 rounded-xl bg-background p-5 sm:p-10'
          )}
        >
          <Link href={appPath('home')}>
            <AppLogo size={96} />
          </Link>
          <h1 className="text-5xl font-extrabold drop-shadow-text">
            {appTitle}
          </h1>
          <p className="text-2xl font-semibold drop-shadow-text">
            A platform to build, engage and grow communities.
          </p>
          {!!session.data ? (
            <QuickStart className="max-w-xs sm:max-w-[30em]" />
          ) : (
            <SignInButton isLoading={session.isPending} />
          )}
        </div>
      </div>
    </div>
  );
};
