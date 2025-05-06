import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface MenuItemOpt {
  communityId: string;
}

/** Configure all possible menu items */
export function useMenuItem(opt: MenuItemOpt) {
  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    const { communityId } = opt;
    return [
      {
        key: 'propertyList',
        href: appPath('propertyList', { path: { communityId } }),
        endContent: <Icon icon="property-list" />,
        children: appLabel('propertyList'),
      },
      {
        key: 'communityDashboard',
        href: appPath('communityDashboard', { path: { communityId } }),
        endContent: <Icon icon="dashboard" />,
        children: appLabel('communityDashboard'),
      },
      {
        key: 'communityShare',
        href: appPath('communityShare', { path: { communityId } }),
        endContent: <Icon icon="share" />,
        children: appLabel('communityShare'),
      },
      {
        key: 'communityExport',
        href: appPath('communityExport', { path: { communityId } }),
        children: appLabel('communityExport'),
      },
      {
        key: 'communityImport',
        href: appPath('communityImport', { path: { communityId } }),
        children: appLabel('communityImport'),
      },
    ];
  }, [opt]);

  return menuItemList;
}
