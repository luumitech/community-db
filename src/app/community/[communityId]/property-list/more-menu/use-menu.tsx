import { DropdownItemProps } from '@nextui-org/react';
import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

interface MenuItemEntry extends DropdownItemProps {}

interface MoreMenuOpt {
  communityId: string;
  modifyButtonProps: UseDisclosureReturn['getButtonProps'];
  deleteButtonProps: UseDisclosureReturn['getButtonProps'];
}

/** Controls content of menu items within more menu */
export function useMoreMenu(opt: MoreMenuOpt) {
  const { canEdit } = useAppContext();

  const menuItems = React.useMemo(() => {
    const items: MenuItemEntry[] = [];
    const { communityId, modifyButtonProps, deleteButtonProps } = opt;

    if (canEdit) {
      items.push(
        {
          key: 'modify',
          ...modifyButtonProps(),
          showDivider: true,
          children: 'Modify Community',
        },
        {
          key: 'import',
          href: appPath('communityImport', { communityId }),
          children: appLabel('communityImport'),
        }
      );
    }

    items.push(
      {
        key: 'export',
        href: appPath('communityExport', { communityId }),
        children: appLabel('communityExport'),
      },
      {
        key: 'share',
        href: appPath('communityShare', { communityId }),
        endContent: <Icon icon="share" />,
        children: appLabel('communityShare'),
      },
      {
        key: 'dashboard',
        href: appPath('communityDashboard', { communityId }),
        endContent: <Icon icon="dashboard" />,
        showDivider: canEdit,
        children: appLabel('communityDashboard'),
      }
    );

    if (canEdit) {
      items.push({
        key: 'delete',
        className: 'text-danger',
        ...deleteButtonProps(),
        children: 'Delete Community',
      });
    }

    return items;
  }, [opt, canEdit]);

  return menuItems;
}
