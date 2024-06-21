import { LinkProps } from '@nextui-org/react';
import { useList } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import React from 'react';
import * as R from 'remeda';
import { appPath } from '~/lib/app-path';
import { matchCommunityEditor } from './matcher-util';

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

  /**
   * Return menu arg for a given pathname
   */
  const pathMenuArg = React.useCallback(
    (href: string) => {
      return {
        href,
        isActive: pathname === href,
      };
    },
    [pathname]
  );

  const getItems = React.useCallback(() => {
    const items: MenuItemEntry[] = [];
    // could've used useSelectedLayoutSegments, but it's not
    // memoized
    // See: https://github.com/vercel/next.js/discussions/58944
    const segments = pathname.split('/');
    segments.shift(); // remove the first slash

    const segment = segments.shift();
    switch (segment) {
      case 'community': {
        items.push(
          {
            id: 'welcome',
            ...pathMenuArg(appPath('communityWelcome')),
            children: 'Welcome',
          },
          {
            id: 'select-community',
            ...pathMenuArg(appPath('communitySelect')),
            children: indentMenuItem('Select Community', 1),
          },
          {
            id: 'create-community',
            ...pathMenuArg(appPath('communityCreate')),
            children: indentMenuItem('Create Community', 1),
          }
        );
        handleCommunity();
        break;
      }
    }
    return items;

    function handleCommunity() {
      const op = segments.shift();
      switch (op) {
        case 'create':
        case 'select':
          break;
        default:
          if (op != null) {
            const communityId = op;
            handleSingleCommunity(communityId);
          }
          break;
      }
    }

    function handleSingleCommunity(communityId: string) {
      const op = segments.shift();
      items.push(
        {
          id: 'Community',
          isDisabled: true,
          children: 'Community',
        },
        {
          id: 'membership-editor',
          isActive: !!matchCommunityEditor(pathname),
          href: appPath('propertyList', { communityId }),
          children: indentMenuItem('Membership Editor', 1),
        },
        /**
         * Don't want to include import/export because:
         * - These are not frequently used operations
         * - Import should be disabled for user with Viewer Role, but
         *   it is not easy to determine at header level, what
         *   role the user have
         */
        // {
        //   id: 'import-xlsx',
        //   ...pathMenuArg(appPath('communityImport', { communityId })),
        //   children: indentMenuItem('Import', 1),
        // },
        // {
        //   id: 'export-xlsx',
        //   ...pathMenuArg(appPath('communityExport', { communityId })),
        //   children: indentMenuItem('Export', 1),
        // },
        {
          id: 'share',
          ...pathMenuArg(appPath('communityShare', { communityId })),
          children: indentMenuItem('Share', 1),
        },
        {
          id: 'dashboard',
          ...pathMenuArg(appPath('communityDashboard', { communityId })),
          children: indentMenuItem('Dashboard', 1),
        }
      );
    }
  }, [pathname, pathMenuArg]);

  React.useEffect(() => {
    const items = getItems();
    set(items);
  }, [getItems, set]);

  return menuItems;
}
