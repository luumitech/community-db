'use client';
import { Divider } from '@heroui/react';
import React from 'react';
import { PropertyAutocomplete } from '~/community/[communityId]/common/property-autocomplete';
import { LastModified } from '~/view/last-modified';
import { useLayoutContext } from '../layout-context';
import { MoreMenu } from '../more-menu';
import { MembershipDisplay } from './membership-display';
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

  return (
    <>
      <MoreMenu />
      <div className="flex flex-col gap-3">
        <PropertyAutocomplete
          className="sticky top-header-height z-50 bg-background pb-2"
          currentPropertyId={property.id}
        />
        <PropertyDisplay />
        <Divider />
        <MembershipDisplay />
        <OccupantDisplay />
        <LastModified
          updatedAt={property.updatedAt}
          updatedBy={property.updatedBy}
        />
      </div>
    </>
  );
}
