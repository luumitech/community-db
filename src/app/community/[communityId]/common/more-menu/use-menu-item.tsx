import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

/** Configure all possible menu items */
export function useMenuItem() {
  const { community, communityModify, batchPropertyModify, propertyCreate } =
    useLayoutContext();

  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    const communityId = community.id;
    return [
      {
        key: 'propertyList',
        href: appPath('propertyList', { path: { communityId } }),
        endContent: <Icon icon="property-list" />,
        children: appLabel('propertyList'),
      },
      {
        key: 'communityModify',
        onPress: () => communityModify.open({ community }),
        endContent: <Icon icon="modify-community" />,
        children: appLabel('communityModify'),
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
        endContent: <Icon icon="integration" />,
        children: appLabel('thirdPartyIntegration'),
      },
      {
        key: 'communityImport',
        href: appPath('communityImport', { path: { communityId } }),
        children: appLabel('communityImport'),
      },
      {
        key: 'batchPropertyModify',
        onPress: () => batchPropertyModify.open({ community }),
        children: appLabel('batchPropertyModify'),
      },
      {
        key: 'propertyCreate',
        onPress: () => propertyCreate.open({ community }),
        children: appLabel('propertyCreate'),
      },
    ];
  }, [community, communityModify, batchPropertyModify]);

  return menuItemList;
}
