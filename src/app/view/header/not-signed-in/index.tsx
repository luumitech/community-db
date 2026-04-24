import React from 'react';
import { SignInButton, type SignInButtonProps } from './sign-in-button';
import { ThemeToggle } from './theme-toggle';

interface Props extends SignInButtonProps {}

export const NotSignedIn: React.FC<Props> = (props) => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <SignInButton {...props} />
    </div>
  );
};
