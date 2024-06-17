import React from 'react';
import { appPath } from '~/lib/app-path';
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
      key: 'dashboard',
      href: appPath('communityDashboard', { communityId }),
      children: 'Dashboard',
    },
  ];

  return (
    <div>
      <ListBox header="Tool Menu" items={items} />
    </div>
  );
}
