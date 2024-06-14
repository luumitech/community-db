import { Button, NavbarItem } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';

interface Props {}

export const NotSignedIn: React.FC<Props> = ({}) => {
  const query = useSearchParams();

  return (
    <NavbarItem>
      <Button
        color="primary"
        onClick={() => {
          /**
           * You can optionally force provider to google
           */
          signIn(undefined, { callbackUrl: query.get('callbackUrl') ?? '/' });
        }}
      >
        Sign In
      </Button>
    </NavbarItem>
  );
};
