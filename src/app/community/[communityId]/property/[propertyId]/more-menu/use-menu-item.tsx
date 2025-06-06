import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
import { appLabel } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';
import { usePageContext } from '../page-context';

/** Configure all possible menu items */
export function useMenuItem() {
  const {
    community,
    occupantEditor,
    propertyModify,
    membershipEditor,
    propertyDelete,
    communityModify,
  } = usePageContext();
  const baseMenuItem = useBaseMenuItem({ communityId: community.id });

  const menuItemList: MenuItemEntry[] = React.useMemo(() => {
    return [
      ...baseMenuItem,
      {
        key: 'membershipEditor',
        onPress: () => membershipEditor.open({}),
        children: appLabel('membershipEditor'),
      },
      {
        key: 'occupantEditor',
        onPress: () => occupantEditor.open({}),
        children: appLabel('occupantEditor'),
        showDivider: true,
      },
      {
        key: 'propertyModify',
        onPress: () => propertyModify.open({}),
        children: appLabel('propertyModify'),
      },
      {
        key: 'propertyDelete',
        className: 'text-danger',
        onPress: () => propertyDelete.open({}),
        children: appLabel('propertyDelete'),
      },
      {
        key: 'communityModify',
        onPress: () => communityModify.open({ community }),
        endContent: <Icon icon="modify-community" />,
        children: appLabel('communityModify'),
      },
    ];
  }, [
    baseMenuItem,
    membershipEditor,
    occupantEditor,
    propertyModify,
    propertyDelete,
    communityModify,
    community,
  ]);

  return menuItemList;
}
