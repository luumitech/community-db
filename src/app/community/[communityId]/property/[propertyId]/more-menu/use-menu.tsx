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
          key: 'membership-editor',
          ...membershipEditor.disclosure.getButtonProps(),
          children: 'Edit Membership Info',
        },
        {
          key: 'occupant-editor',
          ...occupantEditor.disclosure.getButtonProps(),
          children: 'Edit Member Details',
        },
        {
          key: 'property-list',
          href: appPath('propertyList', { path: { communityId } }),
          endContent: <Icon icon="list" />,
          showDivider: true,
          children: appLabel('propertyList'),
        },
        {
          key: 'modify',
          ...propertyModify.disclosure.getButtonProps(),
          children: 'Modify Property',
        }
      );
    }

    if (isAdmin) {
      items.push({
        key: 'delete',
        className: 'text-danger',
        ...propertyDelete.disclosure.getButtonProps(),
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
