'use client';
import { Link, cn } from '@heroui/react';
import React from 'react';
import { useSession } from '~/custom-hooks/auth';
import { appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env-var';
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
        'w-full min-h-main-height',
        'bg-[url(/image/community-with-people.png)] bg-cover bg-center',
        className
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
          <Link href={appPath('home')}>
            <AppLogo size={96} />
          </Link>
          <h1 className="text-5xl font-extrabold">{appTitle}</h1>
          <p className="text-2xl">
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
