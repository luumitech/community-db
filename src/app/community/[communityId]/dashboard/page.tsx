'use client';
import React from 'react';
import { MoreMenu } from '../common/more-menu';
import { PageContent } from './page-content';
import { PageProvider } from './page-context';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function Dashboard(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;

  return (
    <div className="mt-page-top">
      <MoreMenu omitKeys={['communityDashboard']} />
      <PageProvider communityId={communityId}>
        <PageContent />
      </PageProvider>
    </div>
  );
}
