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
      key: 'dashboard',
      href: `/community/${communityId}/tool/dashboard`,
      children: 'Dashboard',
    },
  ];

  return (
    <div>
      <ListBox header="Tool Menu" items={items} />
    </div>
  );
}
