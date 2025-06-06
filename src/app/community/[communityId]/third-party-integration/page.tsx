'use client';
import React from 'react';
import { MoreMenu } from '../common/more-menu';
import { PageContent } from './page-content';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function thirdPartyIntegration({ params }: RouteArgs) {
  const { communityId } = params;

  return (
    <>
      <MoreMenu
        communityId={communityId}
        omitKeys={['thirdPartyIntegration']}
      />
      <PageContent
        className="flex flex-col h-main-height overflow-hidden"
        communityId={communityId}
      />
    </>
  );
}
