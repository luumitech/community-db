import React from 'react';
import { ListBox, ListboxItemProps } from '~/view/base/list-box';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default async function ToolMenu({ params }: RouteArgs) {
  const { communityId } = params;

  const items: ListboxItemProps[] = [
    {
      key: 'import',
      href: `/community/${communityId}/management/import-xlsx`,
      children: 'Import',
    },
    {
      key: 'export',
      href: `/community/${communityId}/management/export-xlsx`,
      children: 'Export',
    },
  ];

  return (
    <div>
      <ListBox header="Tool Menu" items={items} />
    </div>
  );
}
