'use client';
import React from 'react';
import { ContextProvider } from './context';
import { useSetupSubscription } from './setup-subscription';

interface LayoutProps {
  children: React.ReactNode;
}

export default function CommunityFromIdLayout({ children }: LayoutProps) {
  useSetupSubscription();

  return <ContextProvider>{children}</ContextProvider>;
}
