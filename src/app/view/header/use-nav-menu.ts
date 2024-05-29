import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import React from 'react';
import { MenuItemEntry } from '~/view/header';

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
      const withinToolMatcher = match<{ communityId: string }>(
        '/community/:communityId/tool/(.*)',
        { decode: decodeURIComponent }
      );
      setMenuItems([
        {
          id: 'membership-editor',
          isActive: !!withinEditorMatcher(pathname),
          href: `/community/${communityId}/editor/property-list`,
          children: 'Membership Editor',
        },
        {
          id: 'tools',
          isActive: !!withinToolMatcher(pathname),
          href: `/community/${communityId}/tool/menu`,
          children: 'Tools',
        },
      ]);
    }
  }, [pathname]);

  return menuItems;
}
