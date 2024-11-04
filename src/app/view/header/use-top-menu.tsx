import { useQuery } from '@apollo/client';
import { BreadcrumbItemProps, Skeleton } from '@nextui-org/react';
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

  /** Create link attribute for the top menu items */
  const linkTo = React.useCallback(
    (href: string) => {
      return {
        /**
         * Breadcrumb item cannot use href to perform nextjs navigation
         *
         * See: https://github.com/luumitech/community-db/issues/42
         */
        // href,
        onPress: () => router.push(href),
      };
    },
    [router]
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
        items.push({
          id: 'welcome',
          ...linkTo(appPath('communityWelcome')),
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
            id: 'create',
            ...linkTo(appPath('communityCreate')),
            children: appLabel('communityCreate'),
          });
          break;
        case 'select':
          items.push({
            id: 'create',
            ...linkTo(appPath('communitySelect')),
            children: appLabel('communitySelect'),
          });
          break;
        default:
          items.pop();
          if (op != null && op === ctxCommunityId) {
            items.push({
              id: 'community-editor',
              ...linkTo(
                appPath('propertyList', {
                  path: { communityId: ctxCommunityId },
                })
              ),
              children: <CommunityName communityName={communityName} />,
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
            id: 'import-xlsx',
            ...linkTo(appPath('communityImport', { path: { communityId } })),
            children: appLabel('communityImport'),
          });
          break;

        case 'export-xlsx':
          items.push({
            id: 'export-xlsx',
            ...linkTo(appPath('communityExport', { path: { communityId } })),
            children: appLabel('communityExport'),
          });
          break;

        case 'share':
          items.push({
            id: 'share',
            ...linkTo(appPath('communityShare', { path: { communityId } })),
            children: appLabel('communityShare'),
          });
          break;

        case 'dashboard':
          items.push({
            id: 'tool-dashboard',
            ...linkTo(appPath('communityDashboard', { path: { communityId } })),
            children: appLabel('communityDashboard'),
          });
          break;
      }
    }

    function handlePropertyEditor(communityId: string) {
      const propertyId = segments.shift();
      if (propertyId) {
        items.push({
          id: 'property-editor',
          ...linkTo(appPath('property', { path: { communityId, propertyId } })),
          children: (
            <PropertyAddress
              communityId={communityId}
              propertyId={propertyId}
            />
          ),
        });
      }
    }
  }, [pathname, ctxCommunityId, communityName, linkTo]);

  return menuItems;
}

/** Get community name from Id */
const CommunityName: React.FC<{ communityName: string | undefined }> = ({
  communityName,
}) => {
  return (
    <Skeleton className="rounded-lg" isLoaded={communityName != null}>
      <div className="px-1">{communityName ?? ''}</div>
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

  return (
    <Skeleton className="rounded-lg" isLoaded={!result.loading}>
      <div className="px-1">{address ?? ''}</div>
    </Skeleton>
  );
};
