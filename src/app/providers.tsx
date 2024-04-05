'use client';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface Props {}

export const Providers: React.FC<React.PropsWithChildren<Props>> = async ({
  children,
}) => {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
};
