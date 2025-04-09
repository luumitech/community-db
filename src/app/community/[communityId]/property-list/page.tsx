'use client';
import React from 'react';
import { PageContent } from './page-content';
import { useQueryParam } from './use-query-param';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function PropertyList({ params }: RouteArgs) {
  useQueryParam();
  const { communityId } = params;

  if (communityId == null) {
    return null;
  }
  return <PageContent communityId={communityId} />;
}
