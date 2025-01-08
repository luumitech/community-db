import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface MenuItemOpt {}

/** Configure all possible menu items */
export function useMenuItem(opt: MenuItemOpt) {
  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    return [
      {
        key: 'communityWelcome',
        href: appPath('communityWelcome'),
        children: appLabel('communityWelcome'),
      },
      {
        key: 'communitySelect',
        href: appPath('communitySelect'),
        children: appLabel('communitySelect'),
      },
      {
        key: 'communityCreate',
        href: appPath('communityCreate'),
        children: appLabel('communityCreate'),
      },
    ];
  }, []);

  return menuItemList;
}
