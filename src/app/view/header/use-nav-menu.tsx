import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import React from 'react';
import * as R from 'remeda';
import { MenuItemEntry } from '~/view/header';

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
 * Controls content of navigation menu base on
 * the current URL
 */
export function useNavMenu() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = React.useState<MenuItemEntry[]>([]);

  React.useEffect(() => {
    const withinOneCommunityMatcher = match<{ communityId: string }>(
      '/community/:communityId/(.*)',
      { decode: decodeURIComponent }
    );
    const withinOneCommunity = withinOneCommunityMatcher(pathname);
    if (withinOneCommunity) {
      const { communityId } = withinOneCommunity.params;
      const withinEditorMatcher = match<{ communityId: string }>(
        '/community/:communityId/editor/(.*)',
        { decode: decodeURIComponent }
      );
      setMenuItems([
        {
          id: 'welcome',
          isActive: pathname === '/',
          href: '/',
          children: 'Welcome',
        },
        {
          id: 'membership-editor',
          isActive: !!withinEditorMatcher(pathname),
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
        },
      ]);
    }
  }, [pathname]);

  return menuItems;
}
