import { useQuery } from '@apollo/client';
import { BreadcrumbItemProps } from '@nextui-org/react';
import { useList } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';

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

  const getItems = React.useCallback(async () => {
    const items: MenuItemEntry[] = [];
    // could've used useSelectedLayoutSegments, but it's not
    // memoized
    // See: https://github.com/vercel/next.js/discussions/58944
    const segments = pathname.split('/');
    segments.shift(); // remove the first slash

    const segment = segments.shift();
    switch (segment) {
      case 'community': {
        await handleCommunity();
        break;
      }
    }
    return items;

    async function handleCommunity() {
      const op = segments.shift();
      switch (op) {
        case 'create':
        case 'select':
          break;

        default:
          if (op != null) {
            const communityId = op;
            items.push({
              id: 'community-editor',
              href: `/community/${communityId}/editor/property-list`,
              children: <CommunityName communityId={communityId} />,
            });
            await handleSingleCommunity(communityId);
          }
          break;
      }
    }

    async function handleSingleCommunity(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'editor':
          await handleCommunityEditor(communityId);
          break;

        case 'management':
          await handleCommunityManagement(communityId);
          break;

        case 'tool':
          await handleCommunityTool(communityId);
          break;
      }
    }

    async function handleCommunityEditor(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'property': {
          const propertyId = segments.shift();
          if (propertyId) {
            items.push({
              id: 'property-editor',
              href: `/community/${communityId}/editor/property/${propertyId}`,
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

    async function handleCommunityManagement(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'import-xlsx':
          items.push({
            id: 'import-xlsx',
            href: `/community/${communityId}/management/import-xlsx`,
            children: 'Import',
          });
          break;

        case 'export-xlsx':
          items.push({
            id: 'export-xlsx',
            href: `/community/${communityId}/management/export-xlsx`,
            children: 'Export',
          });
          break;
      }
    }

    async function handleCommunityTool(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'dashboard':
          items.push({
            id: 'tool-dashboard',
            href: `/community/${communityId}/tool/dashboard`,
            children: 'Dashboard',
          });
          break;
      }
    }
  }, [pathname]);

  React.useEffect(() => {
    (async () => {
      const items = await getItems();
      set(items);
    })();
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
