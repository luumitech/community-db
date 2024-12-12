'use client';
import React from 'react';

import { PageContent } from './page-content';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function PropertyList({ params }: RouteArgs) {
  return <PageContent />;
}
