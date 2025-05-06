import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface MenuItemOpt {
  communityId: string;
  communityModifyOpen: () => void;
  batchPropertyModifyOpen: () => void;
  communityDeleteOpen: () => void;
  propertyCreateOpen: () => void;
  generateEmailListOpen: () => void;
}

/** Configure all possible menu items */
export function useMenuItem(opt: MenuItemOpt) {
  const { communityId } = opt;
  const baseMenuItems = useBaseMenuItem({ communityId });

  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    return [
      ...baseMenuItems,
      {
        key: 'generateEmailList',
        onPress: opt.generateEmailListOpen,
        endContent: <Icon icon="email-list" />,
        children: 'Generate Email List',
      },
      {
        key: 'communityModify',
        onPress: opt.communityModifyOpen,
        endContent: <Icon icon="settings" />,
        children: 'Modify Community',
      },
      {
        key: 'batchPropertyModify',
        onPress: opt.batchPropertyModifyOpen,
        children: 'Batch Modify Property',
      },
      {
        key: 'propertyCreate',
        onPress: opt.propertyCreateOpen,
        children: 'Create Property',
      },
      {
        key: 'communityDelete',
        className: 'text-danger',
        onPress: opt.communityDeleteOpen,
        children: 'Delete Community',
      },
    ];
  }, [opt, baseMenuItems]);

  return menuItemList;
}
