import { DropdownItemProps } from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { usePageContext } from '../page-context';

interface MenuItemEntry extends DropdownItemProps {}

/** Controls content of menu items within more menu */
export function useMoreMenu() {
  const { canEdit, isAdmin } = useAppContext();
  const {
    community,
    occupantEditor,
    propertyModify,
    membershipEditor,
    propertyDelete,
  } = usePageContext();

  const menuItems = React.useMemo(() => {
    const items: MenuItemEntry[] = [];
    const communityId = community.id;

    if (canEdit) {
      items.push(
        {
          key: 'property-list',
          href: appPath('propertyList', { path: { communityId } }),
          endContent: <Icon icon="property-list" />,
          showDivider: true,
          children: appLabel('propertyList'),
        },
        {
          key: 'membership-editor',
          onPress: membershipEditor.disclosure.onOpen,
          children: 'Edit Membership Info',
        },
        {
          key: 'occupant-editor',
          onPress: occupantEditor.disclosure.onOpen,
          children: 'Edit Member Details',
          showDivider: true,
        },
        {
          key: 'modify',
          onPress: propertyModify.disclosure.onOpen,
          children: 'Modify Property',
        }
      );
    }

    if (isAdmin) {
      items.push({
        key: 'delete',
        className: 'text-danger',
        onPress: propertyDelete.disclosure.onOpen,
        children: 'Delete Property',
      });
    }

    return items;
  }, [
    canEdit,
    isAdmin,
    community,
    occupantEditor,
    propertyModify,
    membershipEditor,
    propertyDelete,
  ]);

  return menuItems;
}
