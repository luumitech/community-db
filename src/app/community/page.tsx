import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { ListBox } from '~/view/base/list-box';

export default function CommunityLanding() {
  return (
    <ListBox
      header="Welcome!"
      items={[
        {
          key: 'select-community',
          href: appPath('communitySelect'),
          children: appLabel('communitySelect'),
        },
        {
          key: 'create-community',
          href: appPath('communityCreate'),
          children: appLabel('communityCreate'),
        },
      ]}
    />
  );
}
