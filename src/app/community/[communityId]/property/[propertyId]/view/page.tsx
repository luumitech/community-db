'use client';
import { Divider } from '@heroui/react';
import React from 'react';
import { PropertyAutocomplete } from '~/community/[communityId]/common/property-autocomplete';
import { GridStackWithCard } from '~/view/base/grid-stack-with-card';
import { LastModified } from '~/view/last-modified';
import { useLayoutContext } from '../layout-context';
import { MoreMenu } from '../more-menu';
import { PropertyDisplay } from './property-display';
import { allowableWidgets } from './widget-definition';

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function Property(props: RouteArgs) {
  const { property } = useLayoutContext();

  return (
    <>
      <MoreMenu />
      <div className="flex flex-col">
        <PropertyAutocomplete
          /**
           * The z-index needs to be the same as the autocomplete blurred
           * background z-index
           */
          className="sticky top-header-height z-50 mb-3 bg-background"
          currentPropertyId={property.id}
        />
        <PropertyDisplay />
        <Divider className="mt-3 mb-1" />
        <GridStackWithCard
          lsSuffix="property-view"
          allowableWidgets={allowableWidgets}
          options={{
            cellHeight: '60px',
          }}
        />
        <LastModified
          updatedAt={property.updatedAt}
          updatedBy={property.updatedBy}
        />
      </div>
    </>
  );
}
