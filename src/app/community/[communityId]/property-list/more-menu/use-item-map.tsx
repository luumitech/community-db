import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useItemMap as useBaseItemMap } from '~/community/[communityId]/more-menu/use-item-map';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface ItemMapOpt {
  communityId: string;
  communityModifyDisclosure: UseDisclosureReturn;
  batchPropertyModifyDisclosure: UseDisclosureReturn;
  communityDeleteDisclosure: UseDisclosureReturn;
  propertyCreateDisclosure: UseDisclosureReturn;
}

/** Configure all possible menu items */
export function useItemMap(opt: ItemMapOpt) {
  const { communityId } = opt;
  const baseItemMap = useBaseItemMap({ communityId });

  const itemMap = React.useMemo(() => {
    const result = new Map<string, MenuItemEntry>(baseItemMap);

    result.set('communityModify', {
      key: 'communityModify',
      onPress: opt.communityModifyDisclosure.onOpen,
      endContent: <Icon icon="settings" />,
      children: 'Modify Community',
    });

    result.set('batchPropertyyModify', {
      key: 'batchPropertyyModify',
      onPress: opt.batchPropertyModifyDisclosure.onOpen,
      children: 'Batch Modify Property',
    });

    result.set('propertyCreate', {
      key: 'propertyCreate',
      onPress: opt.propertyCreateDisclosure.onOpen,
      children: 'Create Property',
    });

    result.set('communityDelete', {
      key: 'communityDelete',
      className: 'text-danger',
      onPress: opt.communityDeleteDisclosure.onOpen,
      children: 'Delete Community',
    });

    return result;
  }, [opt, baseItemMap]);

  return itemMap;
}
