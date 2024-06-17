import React from 'react';
import { appPath } from '~/lib/app-path';
import { ListBox } from '~/view/base/list-box';

export default function CommunityLanding() {
  return (
    <ListBox
      header="Welcome!"
      items={[
        {
          key: 'select-community',
          href: appPath('communitySelect'),
          children: 'Select Community',
        },
        {
          key: 'create-community',
          href: appPath('communityCreate'),
          children: 'Create New Community',
        },
      ]}
    />
  );
}
