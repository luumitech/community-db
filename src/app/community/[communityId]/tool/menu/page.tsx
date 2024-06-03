import React from 'react';
import { MainMenu } from '~/view/main-menu';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default async function ToolMenu({ params }: RouteArgs) {
  const { communityId } = params;

  const items = [
    {
      id: 'import',
      name: 'Import',
      href: `/community/${communityId}/management/import-xlsx`,
    },
    {
      id: 'export',
      name: 'Export',
      href: `/community/${communityId}/management/export-xlsx`,
    },
  ];

  return (
    <div>
      <MainMenu header="Tool Menu" items={items} />
    </div>
  );
}
