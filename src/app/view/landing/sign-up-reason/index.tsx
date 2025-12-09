import { cn } from '@heroui/react';
import React from 'react';
import { useSession } from '~/custom-hooks/auth';
import { appTitle } from '~/lib/env-var';
import { SignInButton } from '~/view/header/not-signed-in/sign-in-button';
import { GetStarted } from './get-started';
import { ListItem } from './list-item';

interface Props {
  className?: string;
}

export const SignUpReason: React.FC<Props> = ({ className }) => {
  const session = useSession();

  return (
    <div
      className={cn(
        'bg-green-200 text-slate-700',
        'dark:bg-gray-900 dark:text-foreground'
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-6 text-wrap text-center',
          'sm:p-18 p-9 md:p-24'
        )}
      >
        <h1 className="text-3xl font-extrabold sm:text-4xl">{appTitle}</h1>
        <p className="text-2xl font-bold sm:text-3xl">
          is a simple and secure way to track, update, and organize member
          information, so you can focus on what matters most:
        </p>
        <p className="text-2xl font-bold sm:text-3xl">
          Growing and connecting your community!
        </p>
        <ol className="text-left text-base sm:text-lg md:text-xl">
          <ListItem>Absolutely free to start</ListItem>
          <ListItem>Sign up with email or Google account</ListItem>
          <ListItem>Add addresses easily using map view</ListItem>
          <ListItem>Visualize membership in dashboard</ListItem>
          <ListItem>Keep track of event ticket sales</ListItem>
        </ol>
        {!!session.data ? (
          <GetStarted />
        ) : (
          <SignInButton isLoading={session.isPending} />
        )}
      </div>
    </div>
  );
};
