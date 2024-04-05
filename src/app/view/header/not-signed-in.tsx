'use client';
import { Button, NavbarItem } from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

interface Props {}

export const NotSignedIn: React.FC<Props> = ({}) => {
  const { data: session } = useSession();
  if (!!session) {
    return null;
  }

  return (
    <NavbarItem>
      <Button
        color="primary"
        onClick={() => signIn('google', { callbackUrl: '/' })}
      >
        Sign In
      </Button>
    </NavbarItem>
  );
};
