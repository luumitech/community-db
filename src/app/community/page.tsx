import React from 'react';
import { ListBox } from '~/view/base/list-box';

export default function CommunityLanding() {
  return (
    <ListBox
      header="Welcome!"
      items={[
        {
          key: 'select-community',
          href: '/community/select',
          children: 'Select Community',
        },
        {
          key: 'create-community',
          href: '/community/create',
          children: 'Create New Community',
        },
      ]}
    />
  );
}
