import { LinkProps } from '@heroui/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import * as R from 'remeda';
import { useSelector } from '~/custom-hooks/redux';
import { appLabel, appPath } from '~/lib/app-path';
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

/** Controls content of hamburger menu located on the left of the header */
export function useNavMenu() {
  const pathname = usePathname();
  const { communityName, isAdmin } = useSelector((state) => state.community);

  /** Return menu arg for a given pathname */
  const pathMenuArg = React.useCallback(
    (href: string) => {
      return {
        href,
        isActive: pathname === href,
      };
    },
    [pathname]
  );

  const menuItems = React.useMemo(() => {
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
            children: appLabel('communityWelcome'),
          },
          {
            id: 'select-community',
            ...pathMenuArg(appPath('communitySelect')),
            children: indentMenuItem(appLabel('communitySelect'), 1),
          },
          {
            id: 'create-community',
            ...pathMenuArg(appPath('communityCreate')),
            children: indentMenuItem(appLabel('communityCreate'), 1),
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
          href: appPath('propertyList', { path: { communityId } }),
          children: indentMenuItem(appLabel('propertyList'), 1),
        }
      );

      if (isAdmin) {
        items.push({
          id: 'import-community',
          ...pathMenuArg(appPath('communityImport', { path: { communityId } })),
          children: indentMenuItem(appLabel('communityImport'), 1),
        });
      }

      items.push(
        {
          id: 'export-xlsx',
          ...pathMenuArg(appPath('communityExport', { path: { communityId } })),
          children: indentMenuItem(appLabel('communityExport'), 1),
        },
        {
          id: 'share',
          ...pathMenuArg(appPath('communityShare', { path: { communityId } })),
          children: indentMenuItem(appLabel('communityShare'), 1),
        },
        {
          id: 'dashboard',
          ...pathMenuArg(
            appPath('communityDashboard', { path: { communityId } })
          ),
          children: indentMenuItem(appLabel('communityDashboard'), 1),
        }
      );
    }
  }, [pathname, pathMenuArg, isAdmin]);

  return menuItems;
}
