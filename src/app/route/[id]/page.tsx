'use client';
import { useSession } from 'next-auth/react';
import type { NextRequest } from 'next/server';
import React from 'react';

interface Props extends NextRequest {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const Test: React.FC<Props> = (req) => {
  const { data: session } = useSession();
  const { id } = req.params;

  console.log({ session });
  return (
    <div>
      test {id}
      <p />
      <a href="/api/auth/signin">Sign in</a>
      <a href="/api/auth/signout">Sign out</a>
    </div>
  );
};

export default Test;
