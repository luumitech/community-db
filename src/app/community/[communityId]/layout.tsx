'use client';
import React from 'react';
import Loading from '~/loading';
import { LayoutProvider } from './layout-context';
import { useCommunityQuery } from './layout-util/community-query';
import { useSetupSubscription } from './layout-util/setup-subscription';

interface Params {
  communityId: string;
}

interface LayoutProps {
  params: Promise<Params>;
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function CommunityFromIdLayout(props: LayoutProps) {
  const { children, modal } = props;
  const params = React.use(props.params);
  const { communityId } = params;
  useSetupSubscription(communityId);
  const community = useCommunityQuery(communityId);

  if (community == null) {
    return <Loading />;
  }

  return (
    <LayoutProvider community={community}>
      {children}
      <React.Fragment key="modal">{modal}</React.Fragment>
    </LayoutProvider>
  );
}
