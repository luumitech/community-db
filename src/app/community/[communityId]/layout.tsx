'use client';
import React from 'react';
import { FilterBarProvider } from './filter-context';
import { useSetupSubscription } from './setup-subscription';

interface Params {
  communityId: string;
}

interface LayoutProps {
  params: Params;
  children: React.ReactNode;
}

export default function CommunityFromIdLayout({
  params,
  children,
}: LayoutProps) {
  const { communityId } = params;
  useSetupSubscription(communityId);

  return (
    <FilterBarProvider communityId={params.communityId}>
      {children}
    </FilterBarProvider>
  );
}
