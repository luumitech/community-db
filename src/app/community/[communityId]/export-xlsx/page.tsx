'use client';
import React from 'react';
import { MoreMenu } from '../common/more-menu';
import { ExportForm } from './export-form';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function ExportXlsx({ params }: RouteArgs) {
  const { communityId } = params;

  return (
    <>
      <MoreMenu communityId={communityId} omitKeys={['communityExport']} />
      <ExportForm
        className="flex flex-col gap-2 h-main-height"
        communityId={communityId}
      />
    </>
  );
}
