import { NavbarItem } from '@heroui/react';
import React from 'react';
import { SignInButton, type SignInButtonProps } from './sign-in-button';

interface Props extends SignInButtonProps {}

export const NotSignedIn: React.FC<Props> = (props) => {
  return (
    <NavbarItem>
      <SignInButton {...props} />
    </NavbarItem>
  );
};
