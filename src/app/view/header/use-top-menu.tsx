import { useQuery } from '@apollo/client';
import { BreadcrumbItemProps } from '@nextui-org/react';
import { useList } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';

interface MenuItemEntry extends BreadcrumbItemProps {
  id: string;
}

/**
 * Controls content of breadcrumb menu located on the top
 * of the header
 */
export function useTopMenu() {
  const pathname = usePathname();
  const [menuItems, { set }] = useList<MenuItemEntry>([]);

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
        items.push({
          id: 'welcome',
          href: appPath('communityWelcome'),
          children: 'Welcome',
        });
        handleCommunity();
        break;
      }
    }
    return items;

    function handleCommunity() {
      const op = segments.shift();
      switch (op) {
        case 'create':
          items.push({
            id: 'create',
            href: appPath('communityCreate'),
            children: 'Create Community',
          });
          break;
        case 'select':
          items.push({
            id: 'create',
            href: appPath('communitySelect'),
            children: 'Select Community',
          });
          break;
        default:
          if (op != null) {
            const communityId = op;
            items.pop();
            items.push({
              id: 'community-editor',
              href: appPath('propertyList', { communityId }),
              children: <CommunityName communityId={communityId} />,
            });
            handleSingleCommunity(communityId);
          }
          break;
      }
    }

    function handleSingleCommunity(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'editor':
          handleCommunityEditor(communityId);
          break;

        case 'management':
          handleCommunityManagement(communityId);
          break;

        case 'tool':
          handleCommunityTool(communityId);
          break;
      }
    }

    function handleCommunityEditor(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'property': {
          const propertyId = segments.shift();
          if (propertyId) {
            items.push({
              id: 'property-editor',
              href: appPath('property', { communityId, propertyId }),
              children: (
                <PropertyAddress
                  communityId={communityId}
                  propertyId={propertyId}
                />
              ),
            });
          }
          break;
        }
      }
    }

    function handleCommunityManagement(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'import-xlsx':
          items.push({
            id: 'import-xlsx',
            href: appPath('communityImport', { communityId }),
            children: 'Import',
          });
          break;

        case 'export-xlsx':
          items.push({
            id: 'export-xlsx',
            href: appPath('communityExport', { communityId }),
            children: 'Export',
          });
          break;

        case 'share':
          items.push({
            id: 'share',
            href: appPath('communityShare', { communityId }),
            children: 'Share',
          });
          break;
      }
    }

    function handleCommunityTool(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'dashboard':
          items.push({
            id: 'tool-dashboard',
            href: appPath('communityDashboard', { communityId }),
            children: 'Dashboard',
          });
          break;
      }
    }
  }, [pathname]);

  React.useEffect(() => {
    const items = getItems();
    set(items);
  }, [getItems, set]);

  return menuItems;
}

const CommunityNameQuery = graphql(/* GraphQL */ `
  query communityName($id: ID!) {
    communityFromId(id: $id) {
      id
      name
    }
  }
`);

/**
 * Get community name from Id
 */
const CommunityName: React.FC<{ communityId: string }> = ({ communityId }) => {
  const result = useQuery(CommunityNameQuery, {
    variables: { id: communityId },
  });
  const communityName = result.data?.communityFromId.name;

  return <div>{communityName ?? ''}</div>;
};

const PropertyNameQuery = graphql(/* GraphQL */ `
  query propertyName($communityId: ID!, $propertyId: ID!) {
    communityFromId(id: $communityId) {
      id
      propertyFromId(id: $propertyId) {
        id
        address
      }
    }
  }
`);

/**
 * Get property address from Id
 */
const PropertyAddress: React.FC<{
  communityId: string;
  propertyId: string;
}> = ({ communityId, propertyId }) => {
  const result = useQuery(PropertyNameQuery, {
    variables: { communityId, propertyId },
  });
  const address = result.data?.communityFromId.propertyFromId.address;

  return <div>{address ?? ''}</div>;
};
