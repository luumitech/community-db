import { DropdownItemProps } from '@nextui-org/react';
import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

interface MenuItemEntry extends DropdownItemProps {}

interface MoreMenuOpt {
  communityId: string;
  communityModifyButtonProps: UseDisclosureReturn['getButtonProps'];
  batchPropertyModifyButtonProps: UseDisclosureReturn['getButtonProps'];
  communityDeleteButtonProps: UseDisclosureReturn['getButtonProps'];
  propertyCreateButtonProps: UseDisclosureReturn['getButtonProps'];
}

/** Controls content of menu items within more menu */
export function useMoreMenu(opt: MoreMenuOpt) {
  const { canEdit, isAdmin } = useAppContext();

  const menuItems = React.useMemo(() => {
    const items: MenuItemEntry[] = [];
    const { communityId } = opt;

    items.push(
      {
        key: 'communityExport',
        href: appPath('communityExport', { path: { communityId } }),
        children: appLabel('communityExport'),
      },
      {
        key: 'communityShare',
        href: appPath('communityShare', { path: { communityId } }),
        endContent: <Icon icon="share" />,
        children: appLabel('communityShare'),
      },
      {
        key: 'communityDashboard',
        href: appPath('communityDashboard', { path: { communityId } }),
        endContent: <Icon icon="dashboard" />,
        showDivider: canEdit,
        children: appLabel('communityDashboard'),
      }
    );

    if (canEdit) {
      items.push(
        {
          key: 'communityModify',
          ...opt.communityModifyButtonProps(),
          children: 'Modify Community',
        },
        {
          key: 'batchPropertyyModify',
          ...opt.batchPropertyModifyButtonProps(),
          showDivider: isAdmin,
          children: 'Batch Modify Property',
        }
      );
    }

    if (isAdmin) {
      items.push(
        {
          key: 'communityImport',
          href: appPath('communityImport', { path: { communityId } }),
          children: appLabel('communityImport'),
        },
        {
          key: 'propertyCreate',
          ...opt.propertyCreateButtonProps(),
          children: 'Create Property',
        },
        {
          key: 'communityDelete',
          className: 'text-danger',
          ...opt.communityDeleteButtonProps(),
          children: 'Delete Community',
        }
      );
    }

    return items;
  }, [opt, canEdit, isAdmin]);

  return menuItems;
}
