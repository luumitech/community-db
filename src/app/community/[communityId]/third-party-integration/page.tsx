'use client';
import React from 'react';
import { MoreMenu } from '../common/more-menu';
import { PageContent } from './page-content';

interface Params {
  communityId: string;
}

interface SearchParams {
  tab?: string;
}

interface RouteArgs {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export default function ThirdPartyIntegration(props: RouteArgs) {
  const { communityId } = React.use(props.params);
  const { tab } = React.use(props.searchParams);

  return (
    <>
      <MoreMenu omitKeys={['thirdPartyIntegration']} />
      <PageContent
        className="flex h-main-height flex-col overflow-hidden"
        communityId={communityId}
        defaultTab={tab}
      />
    </>
  );
}
