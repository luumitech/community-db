import React from 'react';
import { useBaseMenuItem } from '~/community/[communityId]/common/more-menu';
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
        onPress: membershipEditor.disclosure.onOpen,
        children: 'Edit Membership Detail',
      },
      {
        key: 'occupantEditor',
        onPress: occupantEditor.disclosure.onOpen,
        children: 'Edit Member Details',
        showDivider: true,
      },
      {
        key: 'modifyProperty',
        onPress: propertyModify.disclosure.onOpen,
        children: 'Modify Property',
      },
      {
        key: 'deleteProperty',
        className: 'text-danger',
        onPress: propertyDelete.disclosure.onOpen,
        children: 'Delete Property',
      },
      {
        key: 'communityModify',
        onPress: communityModify.disclosure.onOpen,
        endContent: <Icon icon="settings" />,
        children: 'Modify Community',
      },
    ];
  }, [
    baseMenuItem,
    occupantEditor,
    propertyModify,
    membershipEditor,
    propertyDelete,
    communityModify,
  ]);

  return menuItemList;
}
