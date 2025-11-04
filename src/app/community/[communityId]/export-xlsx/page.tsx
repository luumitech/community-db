'use client';
import React from 'react';
import { MoreMenu } from '../common/more-menu';
import { ExportForm } from './export-form';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function ExportXlsx(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;

  return (
    <>
      <MoreMenu omitKeys={['communityExport']} />
      <ExportForm
        className="flex h-main-height flex-col gap-2"
        communityId={communityId}
      />
    </>
  );
}
