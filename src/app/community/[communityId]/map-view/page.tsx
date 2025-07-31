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

export default function MapView(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;

  if (communityId == null) {
    return null;
  }

  return (
    <>
      <MoreMenu omitKeys={['communityMapView']} />
      <PageContent
        className="flex flex-col h-main-height"
        communityId={communityId}
      />
    </>
  );
}
