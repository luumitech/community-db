import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
import { appLabel } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface MenuItemOpt {
  communityDeleteOpen: () => void;
}

/** Configure all possible menu items */
export function useMenuItem(opt: MenuItemOpt) {
  const baseMenuItems = useBaseMenuItem();

  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    return [
      ...baseMenuItems,
      {
        key: 'communityDelete',
        className: 'text-danger',
        onPress: opt.communityDeleteOpen,
        children: appLabel('communityDelete'),
      },
    ];
  }, [opt, baseMenuItems]);

  return menuItemList;
}
