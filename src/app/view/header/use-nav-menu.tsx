import { LinkProps } from '@nextui-org/react';
import { useList } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import React from 'react';
import * as R from 'remeda';
import * as matcherUtil from './matcher-util';

interface MenuItemEntry extends LinkProps {
  id: string;
  isActive?: boolean;
}

function indentMenuItem(label: string, indentLevel = 0) {
  // \u2003 is &emsp;
  const emSpc = R.times(indentLevel, () => '\u2003').join('');
  return (
    <span>
      {emSpc}
      {label}
    </span>
  );
}

/**
 * Controls content of hamburger menu located on the left
 * of the header
 */
export function useNavMenu() {
  const pathname = usePathname();
  const [menuItems, { set }] = useList<MenuItemEntry>([]);

  const getItems = React.useCallback(async () => {
    const items: MenuItemEntry[] = [];
    const withinCommunity = matcherUtil.matchCommunity(pathname);
    if (withinCommunity) {
      const { communityId } = withinCommunity.params;
      items.push(
        {
          id: 'welcome',
          isActive: pathname === '/',
          href: '/',
          children: 'Welcome',
        },
        {
          id: 'membership-editor',
          isActive: !!matcherUtil.matchCommunityEditor(pathname),
          href: `/community/${communityId}/editor/property-list`,
          children: 'Membership Editor',
        },
        {
          id: 'import-xlsx',
          isActive:
            pathname === `/community/${communityId}/management/import-xlsx`,
          href: `/community/${communityId}/management/import-xlsx`,
          children: indentMenuItem('Import', 1),
        },
        {
          id: 'export-xlsx',
          isActive:
            pathname === `/community/${communityId}/management/export-xlsx`,
          href: `/community/${communityId}/management/export-xlsx`,
          children: indentMenuItem('Export', 1),
        },
        {
          id: 'tools',
          isActive: pathname === `/community/${communityId}/tool/menu`,
          href: `/community/${communityId}/tool/menu`,
          children: 'Tools',
        },
        {
          id: 'dashboard',
          isActive: pathname === `/community/${communityId}/tool/dashboard`,
          href: `/community/${communityId}/tool/dashboard`,
          children: indentMenuItem('Dashboard', 1),
        }
      );
    }
    return items;
  }, [pathname]);

  React.useEffect(() => {
    (async () => {
      const items = await getItems();
      set(items);
    })();
  }, [getItems, set]);

  return menuItems;
}
