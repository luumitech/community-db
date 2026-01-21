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

export default function ExportContact(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;

  return (
    <>
      <MoreMenu omitKeys={['contactExport']} />
      <PageContent communityId={communityId} />
    </>
  );
}
