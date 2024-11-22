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
      items.push({
        key: 'communityModify',
        ...opt.communityModifyButtonProps(),
        children: 'Modify Community',
      });
    }

    if (isAdmin) {
      items.push(
        {
          key: 'communityImport',
          href: appPath('communityImport', { path: { communityId } }),
          children: appLabel('communityImport'),
        },
        {
          key: 'batchPropertyModify',
          href: appPath('batchPropertyModify', { path: { communityId } }),
          children: appLabel('batchPropertyModify'),
        },
        {
          key: 'propertyCreate',
          ...opt.propertyCreateButtonProps(),
          children: 'Create Property',
        }
      );
    }

    if (isAdmin) {
      items.push({
        key: 'communityDelete',
        className: 'text-danger',
        ...opt.communityDeleteButtonProps(),
        children: 'Delete Community',
      });
    }

    return items;
  }, [opt, canEdit, isAdmin]);

  return menuItems;
}
