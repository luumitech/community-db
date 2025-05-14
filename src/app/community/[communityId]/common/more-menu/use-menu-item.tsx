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
        key: 'contactExport',
        href: appPath('contactExport', { path: { communityId } }),
        endContent: <Icon icon="export-contact" />,
        children: appLabel('contactExport'),
      },
      {
        key: 'communityExport',
        href: appPath('communityExport', { path: { communityId } }),
        endContent: <Icon icon="export-xlsx" />,
        children: appLabel('communityExport'),
      },
      {
        key: 'thirdPartyIntegration',
        href: appPath('thirdPartyIntegration', { path: { communityId } }),
        endContent: <Icon icon="mailchimp" />,
        children: appLabel('thirdPartyIntegration'),
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
