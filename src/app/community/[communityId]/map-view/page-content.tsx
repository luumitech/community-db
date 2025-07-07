'use client';
import { useQuery } from '@apollo/client';
import { cn } from '@heroui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { GpsStatus } from './gps-status';
import { PageProvider } from './page-context';
import { YearSelect } from './year-select';

// Load leaflet dynamically to avoid 'undefined window' error
const Map = dynamic(
  async () => {
    const { MapView } = await import('./map-view');
    return MapView;
  },
  { ssr: false }
);

const MapView_CommunityQuery = graphql(/* GraphQL */ `
  query mapViewCommunity($id: String!) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: { withGps: true }) {
        id
        address
        lat
        lon
      }
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
}

export const PageContent: React.FC<Props> = ({ className, communityId }) => {
  const [selectedYear, setSelectedYear] = React.useState<number>();
  const result = useQuery(MapView_CommunityQuery, {
    variables: { id: communityId },
  });
  useGraphqlErrorHandler(result);

  const community = result.data?.communityFromId;
  if (community == null) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <YearSelect
        defaultSelectedKeys={selectedYear ? [selectedYear.toString()] : []}
        onSelectionChange={(keys) => {
          const [firstKey] = keys;
          setSelectedYear?.(parseInt(firstKey as string, 10));
        }}
      />
      <PageProvider community={community}>
        <GpsStatus />
        <Map className="grow" />
      </PageProvider>
    </div>
  );
};
