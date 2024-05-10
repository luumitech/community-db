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
    const withinEditor = match<{ id: string }>('/community/:id/(.*)', {
      decode: decodeURIComponent,
    });
    const editorMatch = withinEditor(pathname);
    if (editorMatch) {
      setMenuItems([
        {
          id: 'membership-editor',
          isActive: pathname.endsWith('/property-list'),
          href: `/community/${editorMatch.params.id}/property-list`,
          children: 'Membership Editor',
        },
        {
          id: 'tools',
          isActive: pathname.endsWith('/tool'),
          href: '#',
          children: 'Tools',
        },
      ]);
    }
  }, [pathname]);

  return menuItems;
}
