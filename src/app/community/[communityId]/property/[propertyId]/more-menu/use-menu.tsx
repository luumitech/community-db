import { DropdownItemProps } from '@nextui-org/react';
import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

interface MenuItemEntry extends DropdownItemProps {}

interface MoreMenuOpt {
  communityId: string;
  propertyId: string;
  propertyModifyButtonProps: UseDisclosureReturn['getButtonProps'];
  propertyDeleteButtonProps: UseDisclosureReturn['getButtonProps'];
  membershipEditorButtonProps: UseDisclosureReturn['getButtonProps'];
  occupantEditorButtonProps: UseDisclosureReturn['getButtonProps'];
}

/** Controls content of menu items within more menu */
export function useMoreMenu(opt: MoreMenuOpt) {
  const { canEdit, isAdmin } = useAppContext();

  const menuItems = React.useMemo(() => {
    const items: MenuItemEntry[] = [];
    const { communityId } = opt;

    if (canEdit) {
      items.push(
        {
          key: 'membership-editor',
          ...opt.membershipEditorButtonProps(),
          children: 'Edit Membership Info',
        },
        {
          key: 'occupant-editor',
          ...opt.occupantEditorButtonProps(),
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
          ...opt.propertyModifyButtonProps(),
          children: 'Modify Property',
        }
      );
    }

    if (isAdmin) {
      items.push({
        key: 'delete',
        className: 'text-danger',
        ...opt.propertyDeleteButtonProps(),
        children: 'Delete Property',
      });
    }

    return items;
  }, [opt, canEdit, isAdmin]);

  return menuItems;
}
