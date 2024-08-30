import { DropdownItemProps } from '@nextui-org/react';
import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

interface MenuItemEntry extends DropdownItemProps {}

interface MoreMenuOpt {
  propertyId: string;
  propertyModifyButtonProps: UseDisclosureReturn['getButtonProps'];
  membershipEditorButtonProps: UseDisclosureReturn['getButtonProps'];
  occupantEditorButtonProps: UseDisclosureReturn['getButtonProps'];
  deleteButtonProps: UseDisclosureReturn['getButtonProps'];
}

/** Controls content of menu items within more menu */
export function useMoreMenu(opt: MoreMenuOpt) {
  const { canEdit } = useAppContext();

  const menuItems = React.useMemo(() => {
    const items: MenuItemEntry[] = [];
    const { propertyId } = opt;

    if (canEdit) {
      items.push(
        {
          key: 'modify',
          ...opt.propertyModifyButtonProps(),
          showDivider: true,
          children: 'Modify Property',
        },
        {
          key: 'membership-editor',
          ...opt.membershipEditorButtonProps(),
          children: 'Edit Membership Info',
        },
        {
          key: 'occupant-editor',
          ...opt.occupantEditorButtonProps(),
          showDivider: true,
          children: 'Edit Member Details',
        },
        {
          key: 'delete',
          className: 'text-danger',
          ...opt.deleteButtonProps(),
          children: 'Delete Property',
        }
      );
    }

    return items;
  }, [opt, canEdit]);

  return menuItems;
}
