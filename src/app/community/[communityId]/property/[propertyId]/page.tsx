'use client';
import { Divider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { PropertySearchBar } from '~/community/[communityId]/common/property-search-bar';
import { appPath } from '~/lib/app-path';
import { LastModified } from '~/view/last-modified';
import { useLayoutContext } from './layout-context';
import { MembershipDisplay } from './membership-display';
import { MoreMenu } from './more-menu';
import { OccupantDisplay } from './occupant-display';
import { PropertyDisplay } from './property-display';

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function Property(props: RouteArgs) {
  const { property, community } = useLayoutContext();
  const router = useRouter();
  const routerCalled = React.useRef(false);

  const onSearchChanged = React.useCallback(() => {
    if (!routerCalled.current) {
      const propertyListPath = appPath('propertyList', {
        path: { communityId: community.id },
      });
      routerCalled.current = true;
      router.push(propertyListPath);
    }
  }, [router, community.id]);

  return (
    <div className="flex flex-col gap-3">
      <MoreMenu />
      <PropertySearchBar onChange={onSearchChanged} />
      <PropertyDisplay />
      <Divider />
      <MembershipDisplay />
      <OccupantDisplay />
      <LastModified
        updatedAt={property.updatedAt}
        updatedBy={property.updatedBy}
      />
    </div>
  );
}
