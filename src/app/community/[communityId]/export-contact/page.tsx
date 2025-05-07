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

export default function exportContact({ params }: RouteArgs) {
  const { communityId } = params;

  return (
    <>
      <MoreMenu communityId={communityId} omitKeys={['export-contact']} />
      <PageContent
        className="flex flex-col gap-2 h-main-height"
        communityId={communityId}
      />
    </>
  );
}
