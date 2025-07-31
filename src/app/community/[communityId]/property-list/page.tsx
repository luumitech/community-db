'use client';
import React from 'react';
import { PageContent } from './page-content';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function PropertyList(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;

  if (communityId == null) {
    return null;
  }
  return <PageContent communityId={communityId} />;
}
