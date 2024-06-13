import { useLazyQuery } from '@apollo/client';
import { BreadcrumbItemProps } from '@nextui-org/react';
import { useList } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';

const CommunityNameFromIdQuery = graphql(/* GraphQL */ `
  query communityNameFromId($id: ID!) {
    communityFromId(id: $id) {
      id
      name
    }
  }
`);

const PropertyNameFromIdQuery = graphql(/* GraphQL */ `
  query propertyNameFromId($communityId: ID!, $propertyId: ID!) {
    communityFromId(id: $communityId) {
      id
      propertyFromId(id: $propertyId) {
        id
        address
      }
    }
  }
`);

interface MenuItemEntry extends BreadcrumbItemProps {
  id: string;
}

/**
 * Controls content of breadcrumb menu located on the top
 * of the header
 */
export function useTopMenu() {
  const pathname = usePathname();
  const [communityNameQuery] = useLazyQuery(CommunityNameFromIdQuery);
  const [propertyNameQuery] = useLazyQuery(PropertyNameFromIdQuery);
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
        const communityId = segments.shift();
        if (communityId) {
          const result = await communityNameQuery({
            variables: { id: communityId },
          });
          const communityName = result.data?.communityFromId.name;
          if (communityName) {
            items.push({
              id: 'community-editor',
              href: `/community/${communityId}/editor/property-list`,
              children: communityName,
            });
          }
          await handleCommunity(communityId);
        }
        break;
      }
    }
    return items;

    async function handleCommunity(communityId: string) {
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
            const result = await propertyNameQuery({
              variables: { communityId, propertyId },
            });
            const address = result.data?.communityFromId.propertyFromId.address;
            if (address) {
              items.push({
                id: 'property-editor',
                href: `/community/${communityId}/editor/property/${propertyId}`,
                children: address,
              });
            }
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
  }, [pathname, communityNameQuery, propertyNameQuery]);

  React.useEffect(() => {
    (async () => {
      const items = await getItems();
      set(items);
    })();
  }, [getItems, set]);

  return menuItems;
}
