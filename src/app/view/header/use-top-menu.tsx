import { useQuery } from '@apollo/client';
import { BreadcrumbItemProps, Skeleton } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { graphql } from '~/graphql/generated';
import { appLabel, appPath } from '~/lib/app-path';

interface MenuItemEntry extends BreadcrumbItemProps {
  id: string;
}

/** Controls content of breadcrumb menu located on the top of the header */
export function useTopMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { communityId: ctxCommunityId, communityName } = useAppContext();

  const menuItems = React.useMemo(() => {
    const items: MenuItemEntry[] = [];
    // could've used useSelectedLayoutSegments, but it's not
    // memoized
    // See: https://github.com/vercel/next.js/discussions/58944
    const segments = pathname.split('/');
    segments.shift(); // remove the first slash

    const segment = segments.shift();
    switch (segment) {
      case 'tutorial': {
        items.push({
          id: 'communityWelcome',
          href: appPath('communityWelcome'),
          children: appLabel('communityWelcome'),
        });
        items.push({
          id: 'tutorial',
          href: appPath('tutorial'),
          children: appLabel('tutorial'),
        });
        break;
      }

      case 'community': {
        items.push({
          id: 'communityWelcome',
          href: appPath('communityWelcome'),
          children: appLabel('communityWelcome'),
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
            id: 'communityCreate',
            href: appPath('communityCreate'),
            children: appLabel('communityCreate'),
          });
          break;
        case 'select':
          items.push({
            id: 'communitySelect',
            href: appPath('communitySelect'),
            children: appLabel('communitySelect'),
          });
          break;
        default:
          if (op != null && op === ctxCommunityId) {
            items.pop();
            items.push({
              id: 'propertyList',
              href: appPath('propertyList', {
                path: { communityId: ctxCommunityId },
              }),
              children: (
                <BreadcrumbLabel
                  label={communityName ?? ''}
                  loading={communityName == null}
                />
              ),
            });
            handleSingleCommunity(ctxCommunityId);
          }
          break;
      }
    }

    function handleSingleCommunity(communityId: string) {
      const op = segments.shift();
      switch (op) {
        case 'property':
          handlePropertyEditor(communityId);
          break;

        case 'import-xlsx':
          items.push({
            id: 'communityImport',
            href: appPath('communityImport', { path: { communityId } }),
            children: appLabel('communityImport'),
          });
          break;

        case 'export-xlsx':
          items.push({
            id: 'communityExport',
            href: appPath('communityExport', { path: { communityId } }),
            children: appLabel('communityExport'),
          });
          break;

        case 'export-contact':
          items.push({
            id: 'contactExport',
            href: appPath('contactExport', { path: { communityId } }),
            children: appLabel('contactExport'),
          });
          break;

        case 'third-party-integration':
          items.push({
            id: 'thirdPartyIntegration',
            href: appPath('thirdPartyIntegration', { path: { communityId } }),
            children: appLabel('thirdPartyIntegration'),
          });
          break;

        case 'share':
          items.push({
            id: 'communityExport',
            href: appPath('communityExport', { path: { communityId } }),
            children: appLabel('communityShare'),
          });
          break;

        case 'dashboard':
          items.push({
            id: 'communityDashboard',
            href: appPath('communityDashboard', { path: { communityId } }),
            children: appLabel('communityDashboard'),
          });
          break;
      }
    }

    function handlePropertyEditor(communityId: string) {
      const propertyId = segments.shift();
      if (propertyId) {
        items.push({
          id: 'property',
          href: appPath('property', { path: { communityId, propertyId } }),
          children: (
            <PropertyAddress
              communityId={communityId}
              propertyId={propertyId}
            />
          ),
        });
      }
    }
  }, [pathname, ctxCommunityId, communityName]);

  return menuItems;
}

const BreadcrumbLabel: React.FC<{ label: string; loading?: boolean }> = ({
  label,
  loading,
}) => {
  return (
    <Skeleton className="rounded-lg max-w-full" isLoaded={!loading}>
      <div className="overflow-hidden text-ellipsis">{label ?? ''}</div>
    </Skeleton>
  );
};

const PropertyNameQuery = graphql(/* GraphQL */ `
  query propertyName($communityId: String!, $propertyId: String!) {
    communityFromId(id: $communityId) {
      id
      propertyFromId(id: $propertyId) {
        id
        address
      }
    }
  }
`);

/** Get property address from Id */
const PropertyAddress: React.FC<{
  communityId: string;
  propertyId: string;
}> = ({ communityId, propertyId }) => {
  const result = useQuery(PropertyNameQuery, {
    variables: { communityId, propertyId },
  });
  const address = result.data?.communityFromId.propertyFromId.address;

  return <BreadcrumbLabel label={address ?? ''} loading={result.loading} />;
};
