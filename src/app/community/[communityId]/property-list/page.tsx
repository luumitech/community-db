'use client';
import React from 'react';

import { PageContent } from './page-content';
import { FilterBarProvider } from './property-filter-bar/context';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function PropertyList({ params }: RouteArgs) {
  return (
    <FilterBarProvider communityId={params.communityId}>
      <PageContent />
    </FilterBarProvider>
  );
}
