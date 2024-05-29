import React from 'react';
import { ExportForm } from './export-form';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default async function ExportXlsx({ params }: RouteArgs) {
  const { communityId } = params;

  return (
    <div>
      <ExportForm communityId={communityId} />
    </div>
  );
}
