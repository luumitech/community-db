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

  return session ? <div>...signing out</div> : <div>you are signed out</div>;
};

export default SignOut;
