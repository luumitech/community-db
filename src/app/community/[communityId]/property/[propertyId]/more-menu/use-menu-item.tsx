import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
import { appLabel, appPath } from '~/lib/app-path';
import { type MenuItemEntry } from '~/view/header';
import { useLayoutContext } from '../layout-context';

/** Configure all possible menu items */
export function useMenuItem() {
  const { community, property } = useLayoutContext();
  const baseMenuItem = useBaseMenuItem();

  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    return [
      ...baseMenuItem,
      {
        key: 'membershipEditor',
        href: appPath('membershipEditor', {
          path: { communityId: community.id, propertyId: property.id },
        }),
        children: appLabel('membershipEditor'),
      },
      {
        key: 'occupantEditor',
        href: appPath('occupantEditor', {
          path: { communityId: community.id, propertyId: property.id },
        }),
        children: appLabel('occupantEditor'),
        showDivider: true,
      },
      {
        key: 'propertyModify',
        href: appPath('propertyModify', {
          path: { communityId: community.id, propertyId: property.id },
        }),
        children: appLabel('propertyModify'),
      },
      {
        key: 'propertyDelete',
        className: 'text-danger',
        href: appPath('propertyDelete', {
          path: { communityId: community.id, propertyId: property.id },
        }),
        children: appLabel('propertyDelete'),
      },
    ];
  }, [baseMenuItem, community, property]);

  return menuItemList;
}
