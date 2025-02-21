import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface MenuItemOpt {
  communityId: string;
  communityModifyDisclosure: UseDisclosureReturn;
  batchPropertyModifyDisclosure: UseDisclosureReturn;
  communityDeleteDisclosure: UseDisclosureReturn;
  propertyCreateDisclosure: UseDisclosureReturn;
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
        onPress: opt.communityModifyDisclosure.onOpen,
        endContent: <Icon icon="settings" />,
        children: 'Modify Community',
      },
      {
        key: 'batchPropertyModify',
        onPress: opt.batchPropertyModifyDisclosure.onOpen,
        children: 'Batch Modify Property',
      },
      {
        key: 'propertyCreate',
        onPress: opt.propertyCreateDisclosure.onOpen,
        children: 'Create Property',
      },
      {
        key: 'communityDelete',
        className: 'text-danger',
        onPress: opt.communityDeleteDisclosure.onOpen,
        children: 'Delete Community',
      },
    ];
  }, [opt, baseMenuItems]);

  return menuItemList;
}
