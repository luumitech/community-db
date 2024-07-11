import { NavbarItem } from '@nextui-org/react';
import React from 'react';
import { SignInButton } from './sign-in-button';

interface Props {}

export const NotSignedIn: React.FC<Props> = ({}) => {
  return (
    <NavbarItem>
      <SignInButton />
    </NavbarItem>
  );
};
