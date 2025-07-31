'use client';
import React from 'react';
import { MoreMenu } from '../common/more-menu';
import { PageContent } from './page-content';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function ThirdPartyIntegration(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;

  return (
    <>
      <MoreMenu omitKeys={['thirdPartyIntegration']} />
      <PageContent
        className="flex flex-col h-main-height overflow-hidden"
        communityId={communityId}
      />
    </>
  );
}
