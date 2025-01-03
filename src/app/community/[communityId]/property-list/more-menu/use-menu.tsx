import { DropdownItemProps } from '@nextui-org/react';
import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useGenerateEmail } from '~/custom-hooks/generate-email';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

interface MenuItemEntry extends DropdownItemProps {}

interface MoreMenuOpt {
  communityId: string;
  communityModifyDisclosure: UseDisclosureReturn;
  batchPropertyModifyDisclosure: UseDisclosureReturn;
  communityDeleteDisclosure: UseDisclosureReturn;
  propertyCreateDisclosure: UseDisclosureReturn;
}

/** Controls content of menu items within more menu */
export function useMoreMenu(opt: MoreMenuOpt) {
  const { canEdit, isAdmin } = useAppContext();
  const generateEmail = useGenerateEmail();

  const menuItems = React.useMemo(() => {
    const items: MenuItemEntry[] = [];
    const { communityId } = opt;

    items.push(
      {
        key: 'communityDashboard',
        href: appPath('communityDashboard', { path: { communityId } }),
        endContent: <Icon icon="dashboard" />,
        children: appLabel('communityDashboard'),
      },
      {
        key: 'communityShare',
        href: appPath('communityShare', { path: { communityId } }),
        endContent: <Icon icon="share" />,
        children: appLabel('communityShare'),
      },
      {
        key: 'exportEmail',
        endContent: <Icon icon="copy" />,
        onPress: () => generateEmail(),
        children: 'Export Email List',
        description: 'Modify filter to alter list',
      },
      {
        key: 'communityExport',
        href: appPath('communityExport', { path: { communityId } }),
        children: appLabel('communityExport'),
        showDivider: canEdit,
      }
    );

    if (canEdit) {
      items.push(
        {
          key: 'communityModify',
          onPress: opt.communityModifyDisclosure.onOpen,
          endContent: <Icon icon="settings" />,
          children: 'Modify Community',
        },
        {
          key: 'batchPropertyyModify',
          onPress: opt.batchPropertyModifyDisclosure.onOpen,
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
          onPress: opt.propertyCreateDisclosure.onOpen,
          children: 'Create Property',
        },
        {
          key: 'communityDelete',
          className: 'text-danger',
          onPress: opt.communityDeleteDisclosure.onOpen,
          children: 'Delete Community',
        }
      );
    }

    return items;
  }, [opt, canEdit, isAdmin, generateEmail]);

  return menuItems;
}
