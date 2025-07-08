'use client';
import React from 'react';
import { LayoutProvider } from './layout-context';
import { useCommunityQuery } from './layout-util/community-query';
import { useSetupSubscription } from './layout-util/setup-subscription';

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
  const community = useCommunityQuery(communityId);

  if (community == null) {
    return null;
  }

  return <LayoutProvider community={community}>{children}</LayoutProvider>;
}
