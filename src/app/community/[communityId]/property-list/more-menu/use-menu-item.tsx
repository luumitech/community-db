import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

/** Configure all possible menu items */
export function useMenuItem() {
  const { communityId } = useLayoutContext();
  const baseMenuItems = useBaseMenuItem();

  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    return [
      ...baseMenuItems,
      {
        key: 'communityDelete',
        className: 'text-danger',
        href: appPath('communityDelete', { path: { communityId } }),
        children: appLabel('communityDelete'),
      },
    ];
  }, [baseMenuItems, communityId]);

  return menuItemList;
}
