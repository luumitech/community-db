import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
import { appLabel } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface MenuItemOpt {
  communityId: string;
  communityModifyOpen: () => void;
  batchPropertyModifyOpen: () => void;
  communityDeleteOpen: () => void;
  propertyCreateOpen: () => void;
}

/** Configure all possible menu items */
export function useMenuItem(opt: MenuItemOpt) {
  const { communityId } = opt;
  const baseMenuItems = useBaseMenuItem({ communityId });

  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    return [
      ...baseMenuItems,
      {
        key: 'communityModify',
        onPress: opt.communityModifyOpen,
        endContent: <Icon icon="modify-community" />,
        children: appLabel('communityModify'),
      },
      {
        key: 'batchPropertyModify',
        onPress: opt.batchPropertyModifyOpen,
        children: appLabel('batchPropertyModify'),
      },
      {
        key: 'propertyCreate',
        onPress: opt.propertyCreateOpen,
        children: appLabel('propertyCreate'),
      },
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
