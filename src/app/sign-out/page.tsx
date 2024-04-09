'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

interface Props {}

const SignOut: React.FC<Props> = () => {
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session) {
      signOut();
    }
  }, [session]);

  if (session) {
    return <div>...signing out</div>;
  }

  return <div>you are signed out</div>;
};

export default SignOut;
